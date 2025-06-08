import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import {
  JournalLayout,
  updateJournalLayout,
  useJournalLayout,
} from '@penx/hooks/useJournalLayout'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function JournalLayoutMenu({ children, className }: ItemProps) {
  const [open, setOpen] = useState(false)
  const { data: layout, isLoading } = useJournalLayout()
  return (
    <div
      className={cn(
        'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
        className,
      )}
      onClick={() => {
        setOpen(!open)
      }}
    >
      <div className="font-medium">
        <Trans>Journal layout</Trans>
      </div>
      <div>
        <ChevronRightIcon className="text-foreground/50" />
      </div>
      <Drawer open={open} setOpen={setOpen}>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Theme</Trans>
          </DrawerTitle>
        </DrawerHeader>

        {layout && (
          <Menu>
            <MenuItem
              checked={layout == JournalLayout.BUBBLE}
              onClick={() => {
                updateJournalLayout(JournalLayout.BUBBLE)
                setOpen(false)
              }}
            >
              <Trans>Bubble</Trans>
            </MenuItem>
            <MenuItem
              checked={layout == JournalLayout.CARD}
              onClick={() => {
                updateJournalLayout(JournalLayout.CARD)
                setOpen(false)
              }}
            >
              <Trans>Card</Trans>
            </MenuItem>
            <MenuItem
              checked={layout == JournalLayout.LIST}
              onClick={() => {
                updateJournalLayout(JournalLayout.LIST)
                setOpen(false)
              }}
            >
              <Trans>List</Trans>
            </MenuItem>
          </Menu>
        )}
      </Drawer>
    </div>
  )
}
