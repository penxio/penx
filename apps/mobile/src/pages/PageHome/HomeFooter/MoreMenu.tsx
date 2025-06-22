'use client'

import { useEffect, useState } from 'react'
import { MenuItem } from '@/components/ui/MenuItem'
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
import { format } from 'date-fns'
import { ArrowLeftIcon, EllipsisIcon, XIcon } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { Portal } from '@penx/uikit/Portal'
import { Button } from '@penx/uikit/ui/button'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import { MobileCalendar } from '@penx/uikit/ui/mobile-calendar'
import { cn } from '@penx/utils'
import { ProfileAvatar } from '../ProfileAvatar'

interface Props {}

const MotionButton = motion.create(Button)

export function MoreMenu({}: Props) {
  const [open, setOpen] = useState(false)

  const { refs, context, floatingStyles } = useFloating({
    placement: 'top',
    open: open,
    middleware: [offset(0), flip(), shift()],
    onOpenChange: (open) => {
      setOpen(open)
    },
  })
  return (
    <MotionButton
      ref={refs.setReference}
      layoutId="more-menu"
      variant="ghost"
      // layout="position"
      size="icon"
      className="shadow-popover absolute -right-10 top-[10px] size-8 rounded-full bg-white"
      onClick={() => {
        setOpen(true)
      }}
    >
      <ProfileAvatar />
    </MotionButton>
  )
}
