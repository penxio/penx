import React from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { EllipsisIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'
import { useMoreStructDrawer } from '../MoreStructDrawer/useMoreStructDrawer'

interface Props {}

export const AddMoreButton = ({}: Props) => {
  const { setIsOpen } = useMoreStructDrawer()

  return (
    <motion.div
      className="text-background flex size-9 items-center justify-center rounded-full"
      onClick={async (e) => {
        setIsOpen(true)
        await Haptics.impact({ style: ImpactStyle.Medium })
      }}
    >
      <EllipsisIcon size={20} className="text-foreground" />
      {/* <span className="icon-[weui--more-filled] text-foreground size-6"></span> */}
    </motion.div>
  )
}
