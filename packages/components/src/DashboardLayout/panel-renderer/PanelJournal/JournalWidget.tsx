'use client'

import { Trans } from '@lingui/react/macro'
import { CameraIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { LayoutGroup, motion } from 'motion/react'
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
import Face from './moods/grinning_face_with_big_eyes_color.svg?react'

interface Props {
  creations: Creation[]
}

const MotionPlus = motion.create(PlusIcon)
const MotionEditLine = motion.create(EditLine)

export function JournalWidget({ creations }: Props) {
  const { structs } = useStructs()

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
        const structCreations = creations.filter(
          (c) => c.structId === struct.id,
        )

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
          <LayoutGroup key={struct.id}>
            <motion.div
              layoutId={struct.id}
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
                <AddCreationButton struct={struct} />
              </div>
              {structCreations.length > 0 && (
                <div className={cn('flex flex-col gap-2', isTask && 'gap-3')}>
                  {structCreations.map((creation) => {
                    return (
                      <CreationItem creation={creation} key={creation.id} />
                    )
                  })}
                </div>
              )}
            </motion.div>
          </LayoutGroup>
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
        className="text-foreground/80"
        onClick={() => {
          setState({ isTask: true, open: true })
        }}
      />
    )
  }

  if (struct.type === StructType.NOTE) {
    return (
      <motion.span
        className={cn('text-foreground/80 icon-[mdi--feather] size-6')}
        whileTap={{ scale: 1.2 }}
        onClick={() => {
          setState({ isTask: false, open: true })
        }}
      />
    )
  }
  // return <MotionPlus whileTap={{ scale: 1.2 }} className="text-foreground/50" />
  return null
}
