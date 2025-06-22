import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@penx/utils'
import { useTheme } from '../theme-provider'
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
export function ThemeMenu({ children, className }: ItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-between',
        className,
      )}
      onClick={() => {
        setIsOpen(!isOpen)
      }}
    >
      <div className="font-medium">
        <Trans>Theme</Trans>
      </div>
      <div>
        <ChevronRightIcon className="text-foreground/50" />
      </div>
      <Drawer open={isOpen} setOpen={setIsOpen}>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Theme</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Menu>
          <MenuItem
            checked={theme == 'light'}
            onClick={() => {
              setTheme('light')
            }}
          >
            <Trans>Light</Trans>
          </MenuItem>
          <MenuItem
            checked={theme == 'dark'}
            onClick={() => {
              setTheme('dark')
            }}
          >
            <Trans>Dark</Trans>
          </MenuItem>
          <MenuItem
            checked={theme == 'system'}
            onClick={() => {
              setTheme('system')
            }}
          >
            <Trans>System</Trans>
          </MenuItem>
        </Menu>
      </Drawer>
    </div>
  )
}
