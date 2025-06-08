'use client'

import { useState } from 'react'
import { CheckIcon } from 'lucide-react'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { UpgradeContent } from './UpgradeContent'
import { useUpgradeDrawer } from './useUpgradeDrawer'

interface Props {}

export function UpgradeDrawer({}: Props) {
  const { isOpen, setIsOpen } = useUpgradeDrawer()
  const [isMonthly, setIsMonthly] = useState(true)

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} className="min-h-[80vh]">
      <UpgradeContent />
    </Drawer>
  )
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <CheckIcon className="text-green-500" size={16} />
      <div className={cn('text-foreground/')}>{children}</div>
    </div>
  )
}
