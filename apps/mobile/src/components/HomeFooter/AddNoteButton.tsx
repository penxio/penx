import React from 'react'
import { impact } from '@/lib/impact'
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
    await impact()
  })

  return (
    <motion.div
      {...handlers()}
      whileTap={{ scale: 1.1 }}
      className=" relative  flex size-10 select-none items-center justify-center rounded-full"
      onClick={async () => {
        impact()
        onAdd()
      }}
    >
      {/* <span className="icon-[mdi--feather] size-6"></span> */}
      <PlusIcon size={28} className="text-foreground" />
      {/* <span className="icon-[ic--round-plus] size-8"></span> */}
      {/* <span className="icon-[stash--plus-solid] size-8"></span> */}
    </motion.div>
  )
}
