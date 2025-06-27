'use client'

import { Trans } from '@lingui/react/macro'
import { CameraIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { Creation, Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { useStructs } from '@penx/hooks/useStructs'
import { EditLine } from '@penx/icons'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { StructName } from '@penx/widgets/StructName'
import { ColorfulStructIcon } from '../../../ColorfulStructIcon'
import { CreationItem } from './CreationItem/CreationItem'
import { ImageCreation } from './CreationItem/ImageCreation'
import { JournalPhotoWidget } from './JournalPhotoWidget'
import { JournalTitleWidget } from './JournalTitleWidget'

// import Face from './moods/grinning_face_with_big_eyes_color.svg?react'

interface Props {
  creations: Creation[]
}

const MotionPlus = motion.create(PlusIcon)
const MotionEditLine = motion.create(EditLine)

export function JournalWidget({ creations }: Props) {
  const { structs } = useStructs(true)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-[136px] gap-2">
        {/* <div className="bg-background shadow-card flex flex-1 flex-col justify-between rounded-2xl p-3">
          <Face className="size-12 self-start"></Face>
          <div className="text-bae self-end font-bold">开心</div>
        </div> */}
        <JournalTitleWidget creations={creations} />
        <JournalPhotoWidget creations={creations} />
      </div>

      {structs.map((struct) => {
        if (struct.type === StructType.IMAGE) return null
        let structCreations = creations.filter((c) => c.structId === struct.id)

        if (struct.isTask) {
          structCreations = [...structCreations].sort(
            (a, b) => Number(a.checked) - Number(b.checked),
          )
        }

        if (
          !structCreations.length &&
          ![StructType.NOTE, StructType.TASK, StructType.VOICE].includes(
            struct.type as any,
          )
        ) {
          return null
        }

        const isTask = struct.type === StructType.TASK

        return (
          <motion.div
            layoutId={struct.id}
            key={struct.id}
            className="bg-background shadow-card flex flex-col gap-2 rounded-2xl p-3 dark:bg-neutral-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ColorfulStructIcon
                  struct={struct!}
                  className="size-6"
                  emojiSize={12}
                />
                <div className="text-bae font-bold">
                  <StructName struct={struct} />
                </div>
              </div>
              {isMobileApp && <AddCreationButton struct={struct} />}
            </div>
            {structCreations.length > 0 && (
              <div className={cn('flex flex-col gap-2', isTask && 'gap-3')}>
                <AnimatePresence>
                  {structCreations.map((creation) => {
                    return (
                      <CreationItem creation={creation} key={creation.id} />
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function AddCreationButton({ struct }: { struct: Struct }) {
  const { setState } = useQuickInputOpen()
  if (struct.type === StructType.TASK) {
    return (
      <MotionPlus
        whileTap={{ scale: 1.2 }}
        className="text-foreground/80 hover:text-foreground cursor-pointer focus:outline-none"
        onClick={() => {
          appEmitter.emit('IMPACT')
          setState({ isTask: true, open: true, placeholder: 'Add task' })
        }}
      />
    )
  }

  if (struct.type === StructType.NOTE) {
    return (
      <motion.span
        className={cn(
          'text-foreground/80 icon-[mdi--feather] hover:text-foreground size-6 cursor-pointer',
        )}
        whileTap={{ scale: 1.2 }}
        onClick={() => {
          appEmitter.emit('IMPACT')
          setState({ isTask: false, open: true })
        }}
      />
    )
  }
  // return <MotionPlus whileTap={{ scale: 1.2 }} className="text-foreground/50" />
  return null
}
