'use client'

import { Drawer } from '../ui/Drawer'
import { UpgradeContent } from './UpgradeContent'
import { useUpgradeDrawer } from './useUpgradeDrawer'

interface Props {}

export function UpgradeDrawer({}: Props) {
  const { isOpen, setIsOpen } = useUpgradeDrawer()

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} className="min-h-[80vh]">
      <UpgradeContent
        onSubscribeSuccess={() => {
          setIsOpen(false)
        }}
      />
    </Drawer>
  )
}
