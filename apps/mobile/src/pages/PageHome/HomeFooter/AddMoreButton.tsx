import React from 'react'
import { impact } from '@/lib/impact'
import { EllipsisIcon, PlusIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useMoreStructDrawer } from './MoreStructDrawer/useMoreStructDrawer'

interface Props {}

export const AddMoreButton = ({}: Props) => {
  const { setIsOpen } = useMoreStructDrawer()

  return (
    <motion.div
      className="text-background flex size-9 items-center justify-center rounded-full"
      onClick={async (e) => {
        setIsOpen(true)
        await impact()
      }}
    >
      <PlusIcon size={24} className="text-foreground" />
      {/* <EllipsisIcon size={20} className="text-foreground" /> */}
      {/* <span className="icon-[weui--more-filled] text-foreground size-6"></span> */}
    </motion.div>
  )
}
