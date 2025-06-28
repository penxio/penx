import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@penx/utils'
import { AddWidgetButton } from '../EditWidget/AddWidgetButton'
import { EditWidget } from '../EditWidget/EditWidget'
import { useTheme } from '../theme-provider'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function NavigationsMenu({ children, className }: ItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className="font-medium">
          <Trans>Navigations</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader confirmButton={<AddWidgetButton />}>
          <DrawerTitle>
            <Trans>Navigations</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <EditWidget />
      </Drawer>
    </>
  )
}
