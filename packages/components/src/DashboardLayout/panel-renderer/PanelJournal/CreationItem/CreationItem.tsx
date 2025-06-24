'use client'

import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useClickAway } from 'react-use'
import { Portal } from '@ariakit/react'
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  CopyIcon,
  Edit2Icon,
  SparklesIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { LongPressReactEvents, useLongPress } from 'use-long-press'
import { api } from '@penx/api'
import { isMobileApp, TRANSCRIBE_URL } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreationStruct } from '@penx/hooks/useCreationStruct'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { getBgColor, getTextColorByName } from '@penx/libs/color-helper'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { base64StringToFile } from '@penx/utils/base64StringToFile'
import { calculateSHA256FromFile } from '@penx/utils/calculateSHA256FromFile'
import { generateGradient } from '@penx/utils/generateGradient'
import { StructIcon } from '@penx/widgets/StructIcon'
import { useDeleteCreationDialog } from '../../../../Creation/DeleteCreationDialog/useDeleteCreationDialog'
import { CreationReminder } from './CreationReminder'
import { getMotionConfig } from './lib/getMotionConfig'
import { Link } from './Link'
import { Tags } from './Tags'
import { VoiceContent } from './VoiceContent'

interface Props {
  creation: Creation
  onChecked?: () => void
}

export function CreationItem({ creation, onChecked }: Props) {
  const struct = useCreationStruct(creation)
  const [isOpen, setIsOpen] = useState(false)
  const [isTranscribing, setTranscribing] = useState(false)
  const isLongPressed = useRef(false)
  const { copy } = useCopyToClipboard()
  const deletePostDialog = useDeleteCreationDialog()
  const { session } = useSession()
  const { area } = useArea()
  const isFavor = area.favorites?.includes(creation.id)

  const { data: voice } = useQuery({
    queryKey: ['voice', creation.id],
    queryFn: async () => {
      const result = await localDB.voice.get(creation.data['voiceId'])
      return result ? result : null
    },
  })

  const { data: layout, isCard, isList, isBubble } = useJournalLayout()

  const { refs, context, floatingStyles } = useFloating({
    placement: 'bottom',
    open: isOpen,

    middleware: [offset(0), flip(), shift()],
    onOpenChange: (open) => {
      if (!open) isLongPressed.current = false
      setIsOpen(open)
    },
  })

  // useClickAway(refs.floating as any, () => {
  //   setIsOpen(false)
  // })

  function handleClick() {
    console.log('is clieck....:', isOpen)

    if (isMobileApp) {
      if (creation.isVoice) return
      return appEmitter.emit('ROUTE_TO_CREATION', creation)
    }
    store.panels.updateMainPanel({
      id: uniqueId(),
      type: PanelType.CREATION,
      creationId: creation.id,
    })
  }

  const handlers = useLongPress(
    (e: LongPressReactEvents) => {
      setIsOpen(true)
      console.log('Long press completed!')
      appEmitter.emit('IMPACT')
    },
    {
      onStart: () => {
        console.log('start.........')
      },
      onCancel: () => {},
      onFinish: () => {
        isLongPressed.current = false
      },
      // threshold: 500,
      // captureEvent: true,
    },
  )

  async function transcribe() {
    setTranscribing(true)

    const file = base64StringToFile(voice?.recordDataBase64!, voice?.mimeType!)

    const hash = await calculateSHA256FromFile(file)

    try {
      const { text } = await api.transcribe(file, voice!.msDuration, hash)
      // setTranscript(data.text)
      store.creations.updateCreationDataById(creation.id, {
        isTranscribed: true,
        transcribedText: text,
      })
    } catch (err) {
      // alert(`error: ${err.message}`)
      // console.log('error');
    }
    setTranscribing(false)
  }

  const inited = useRef(false)
  useEffect(() => {
    if (!voice) return
    if (creation.transcribedText || inited.current) return
    if (!session?.isPro) return
    inited.current = true
    if (Date.now() - creation.createdAt.getTime() < 5 * 60 * 1000) {
      transcribe()
    }
  }, [voice, creation, session])

  const content = useMemo(() => {
    if (creation.isVoice) {
      return (
        <div>
          {isTranscribing && (
            <div className="flex items-center gap-1">
              <span className="text-foreground/90 text-base">
                <Trans>AI Transcribing</Trans>
              </span>
              <LoadingDots className="bg-foreground" />
            </div>
          )}
          {!isTranscribing && creation.previewedContent && (
            <div>{creation.previewedContent}</div>
          )}
          <VoiceContent creation={creation} />
        </div>
      )
    }

    return (
      <>
        {!creation.isNote && (
          <div className="flex items-center gap-2">
            {creation.isTask && (
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                checked={creation.checked}
                onCheckedChange={(v) => {
                  onChecked?.()
                  appEmitter.emit('IMPACT')
                  updateCreationProps(creation.id, {
                    checked: v as any,
                  })
                }}
              />
            )}

            <div
              className={cn(
                creation.isTask && 'line-clamp-1',
                !creation.isNote && !creation.isTask && 'font-bold',
              )}
            >
              {creation.title || 'untitled'}
            </div>
            <div className="ml-auto">
              <CreationReminder struct={struct} creation={creation} />
            </div>
          </div>
        )}
        {creation.isBookmark && <Link creation={creation} struct={struct} />}
        {creation.previewedContent && !creation.isTask && (
          <div className="line-clamp-2">{creation.previewedContent}</div>
        )}
      </>
    )
  }, [creation, isTranscribing])

  if (!struct) return null
  // console.log('-------floatingStyles:', floatingStyles, context.strategy)

  return (
    <>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          ></motion.div>

          <motion.div
            ref={refs.setFloating}
            className="shadow-popover z-[50] mt-1 flex w-48 flex-col gap-0 rounded-xl bg-white"
            // style={floatingStyles}
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x === 0 ? 16 : context.x,
            }}
            {...getMotionConfig(isOpen, context.placement)}
          >
            {creation.isVoice && (
              <ActionItem
                onClick={async () => {
                  setIsOpen(false)
                  transcribe()
                }}
              >
                <SparklesIcon size={18}></SparklesIcon>
                <span>
                  <Trans>AI transcribe</Trans>
                </span>
              </ActionItem>
            )}

            {creation.isNote && (
              <ActionItem
                onClick={() => {
                  const text = creation.previewedContent
                  copy(text)
                  setIsOpen(false)
                }}
              >
                <CopyIcon size={18}></CopyIcon>
                <span>
                  <Trans>Copy</Trans>
                </span>
              </ActionItem>
            )}

            <ActionItem
              onClick={async () => {
                if (isFavor) {
                  await store.area.removeFromFavorites(creation.id)
                } else {
                  await store.area.addToFavorites(creation.id)
                }
                setIsOpen(false)
              }}
            >
              {isFavor && <StarOffIcon size={18} />}
              {!isFavor && <StarIcon size={18} />}
              <span>
                {isFavor ? <Trans>Unstar</Trans> : <Trans>Star</Trans>}
              </span>
            </ActionItem>
            <ActionItem
              onClick={() => {
                handleClick()
                setIsOpen(false)
              }}
            >
              <Edit2Icon size={18}></Edit2Icon>
              <span>
                <Trans>Edit</Trans>
              </span>
            </ActionItem>
            {/* <ActionItem>
                <ShareIcon size={20}></ShareIcon>
                <span>
                  <Trans>Share</Trans>
                </span>
              </ActionItem> */}

            <ActionItem
              className="text-red-500"
              onClick={() => {
                deletePostDialog.setState({
                  isOpen: true,
                  creation: creation,
                })
                setIsOpen(false)
              }}
            >
              <Trash2Icon size={18}></Trash2Icon>
              <span>
                <Trans>Delete</Trans>
              </span>
            </ActionItem>
          </motion.div>
        </AnimatePresence>
      )}

      <motion.div
        // layoutId={creation.id}
        layout="position"
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-0"
      >
        <motion.div
          className={cn(
            'text-foreground line-clamp-2 flex flex-col text-[16px]',
            isOpen && 'shadow-popover z-[60] rounded-lg bg-white px-3 py-3',
          )}
          // variants={{
          //   open: {
          //     zIndex: 60,
          //     borderRadius: 4,
          //     padding: 12,
          //   },
          //   closed: {
          //     zIndex: 'inherit',
          //     padding: 0,
          //     borderRadius: 0,
          //   },
          // }}
          // animate={isOpen ? 'open' : 'closed'}
          ref={refs.setReference}
          {...handlers()}
          onClick={() => {
            if (!isLongPressed.current) {
              console.log('Single click!')
              // setIsOpen(true)
              if (!isOpen) handleClick()
            }
            isLongPressed.current = false
          }}
        >
          {content}
        </motion.div>

        {!creation.isTask && (
          <div className="flex items-center gap-2">
            <div className="text-foreground/50 text-[10px]">
              {format(creation.createdAt, 'HH:mm')}
            </div>
            <Tags creation={creation} />
          </div>
        )}
      </motion.div>
    </>
  )
}

function ActionItem({
  className,
  children,
  ...rest
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={cn('flex items-center gap-2 px-4 py-2', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
