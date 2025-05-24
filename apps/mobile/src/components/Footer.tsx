import React from 'react'
import { Capacitor } from '@capacitor/core'
import { IonFab } from '@ionic/react'
import { PlusIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'
import { VoiceRecorderButton } from './VoiceRecorderButton'

const platform = Capacitor.getPlatform()

interface Props {
  open: boolean
  onAdd: () => void
}

export const Footer = ({ open, onAdd }: Props) => {
  // if (open) return null
  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="center"
      className="flex w-full flex-col"
    >
      {/* <IonFabButton></IonFabButton> */}

      <div
        className={cn(
          'relative inline-flex items-center justify-center gap-3 pb-4',
        )}
      >
        <div className="relative inline-flex">
          <motion.div
            whileTap={{ scale: 1.2 }}
            className="text-background shadow-popover dark:bg-brand bg-background relative flex size-14 items-center justify-center rounded-full"
            onClick={async () => {
              onAdd()
            }}
          >
            <PlusIcon size={28} className="text-foreground" />
          </motion.div>

          <VoiceRecorderButton />
        </div>
      </div>
    </IonFab>
  )
}
