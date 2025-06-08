import React from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { PlusIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useLongPress } from 'use-long-press'
import { useMoreStructDrawer } from '../MoreStructDrawer/useMoreStructDrawer'

interface Props {
  onAdd: () => void
}

export const AddNoteButton = ({ onAdd }: Props) => {
  const { setIsOpen } = useMoreStructDrawer()
  // if (open) return null
  const handlers = useLongPress(async () => {
    setIsOpen(true)
    await Haptics.impact({ style: ImpactStyle.Medium })
  })

  return (
    <motion.div
      {...handlers()}
      whileTap={{ scale: 1.1 }}
      className=" bg-foreground relative  flex size-10 select-none items-center justify-center rounded-full"
      onClick={async () => {
        onAdd()
      }}
    >
      {/* <span className="icon-[mdi--feather] text-background size-6"></span> */}
      <PlusIcon size={20} className="text-background" />
    </motion.div>
  )
}
