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
import {
  CopyIcon,
  Edit2Icon,
  ShareIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { LongPressReactEvents, useLongPress } from 'use-long-press'
import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreationStruct } from '@penx/hooks/useCreationStruct'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { getBgColor, getTextColorByName } from '@penx/libs/color-helper'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { StructIcon } from '@penx/widgets/StructIcon'
import { useDeleteCreationDialog } from '../Creation/DeleteCreationDialog/useDeleteCreationDialog'
import { getMotionConfig } from './getMotionConfig'
import { Link } from './Link'
import { Tags } from './Tags'
import { VoiceContent } from './VoiceContent'

interface Props {
  creation: Creation
}

enum CreationViewType {
  BUBBLE = 'BUBBLE',
  CARD = 'CARD',
  LIST = 'LIST',
}

export function CreationCard({ creation }: Props) {
  const struct = useCreationStruct(creation)
  const [isOpen, setIsOpen] = useState(false)
  const isLongPressed = useRef(false)
  const { copy } = useCopyToClipboard()
  const deletePostDialog = useDeleteCreationDialog()
  const { area } = useArea()
  const isFavor = area.favorites?.includes(creation.id)

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

  useClickAway(refs.floating as any, () => {
    setIsOpen(false)
  })

  function handleClick() {
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

  const content = useMemo(() => {
    if (creation.isVoice) {
      return <VoiceContent creation={creation} />
    }

    return (
      <>
        {!creation.isNote && (
          <div className="flex items-center gap-2">
            {creation.isTask && (
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                defaultChecked={creation.checked}
                onCheckedChange={(v) => {
                  updateCreationProps(creation.id, {
                    checked: v as any,
                  })
                }}
              />
            )}

            <div
              className={cn(
                '',
                !creation.isNote && !creation.isTask && 'font-bold',
              )}
            >
              {creation.title || 'untitled'}
            </div>
          </div>
        )}
        {creation.isBookmark && <Link creation={creation} struct={struct} />}
        {creation.previewedContent && (
          <div className="line-clamp-5">{creation.previewedContent}</div>
        )}
      </>
    )
  }, [creation])

  if (!struct) return null
  // console.log('-------floatingStyles:', floatingStyles, context.strategy)

  return (
    <>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            ref={refs.setFloating}
            className="shadow-popover z-[10] mt-1 flex w-48 flex-col gap-0 rounded-xl bg-white"
            // style={floatingStyles}
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x === 0 ? 16 : context.x,
            }}
            {...getMotionConfig(isOpen, context.placement)}
          >
            {creation.isNote && (
              <ActionItem
                onClick={() => {
                  const text = creation.previewedContent
                  copy(text)
                  setIsOpen(false)
                }}
              >
                <CopyIcon size={20}></CopyIcon>
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
              {isFavor && <StarOffIcon />}
              {!isFavor && <StarIcon />}
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
              <Edit2Icon size={20}></Edit2Icon>
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
              <Trash2Icon size={20}></Trash2Icon>
              <span>
                <Trans>Delete</Trans>
              </span>
            </ActionItem>
          </motion.div>
        </AnimatePresence>
      )}

      {!isBubble && (
        <div
          className="mb-2 inline-block w-full break-inside-avoid space-y-2 rounded-xl bg-white px-4 py-3 align-top dark:bg-neutral-700"
          ref={refs.setReference}
          {...handlers()}
          onClick={() => {
            if (!isLongPressed.current) {
              console.log('Single click!')
              // setIsOpen(true)
              handleClick()
            }
            isLongPressed.current = false
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StructIcon type={creation.type} className={cn('size-4')} />

              <div className={cn('from-accent-foreground text-xs font-medium')}>
                {struct.name}
              </div>
            </div>

            <div className="text-foreground/50 text-[10px]">
              {creation.formattedTime}
            </div>
          </div>
          <div>
            <motion.div
              // whileTap={{ scale: 1.05 }}
              className="flex flex-col"
            >
              {content}
            </motion.div>
          </div>
          <Tags creation={creation} />
        </div>
      )}

      {isBubble && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StructIcon type={creation.type} className={cn('size-4')} />

              <div className={cn('from-accent-foreground text-xs font-medium')}>
                {struct.name}
              </div>
            </div>

            <div className="text-foreground/50 text-[10px]">
              {creation.formattedTime}
            </div>

            <Tags creation={creation} />
          </div>
          <div>
            <motion.div
              className="shadow-card inline-flex flex-col rounded-xl bg-white px-4 py-3 dark:bg-neutral-700"
              whileTap={{ scale: 1.05 }}
              ref={refs.setReference}
              {...handlers()}
              onClick={() => {
                if (!isLongPressed.current) {
                  console.log('Single click!')
                  // setIsOpen(true)
                  handleClick()
                }
                isLongPressed.current = false
              }}
            >
              {content}
            </motion.div>
          </div>
        </div>
      )}
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
