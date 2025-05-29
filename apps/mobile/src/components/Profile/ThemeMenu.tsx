import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@penx/utils'
import { Drawer } from '../Drawer'
import { useTheme } from '../theme-provider'
import { MenuItem } from './MenuItem'

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
        'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
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
      <Drawer
        open={isOpen}
        setOpen={setIsOpen}
        className="bg-neutral-100 dark:bg-neutral-800"
      >
        <div className="mb-2 text-center font-bold">
          <Trans>Theme</Trans>
        </div>
        <div className="divide-foreground/5 divide-y rounded-xl dark:bg-neutral-700">
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
        </div>
      </Drawer>
    </div>
  )
}
