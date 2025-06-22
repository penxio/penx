import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@penx/utils'
import { useTheme } from '../theme-provider'
import { Drawer } from '../ui/Drawer'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function AboutMenu({ children, className }: ItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <>
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
          <Trans>About</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer
        open={isOpen}
        setOpen={setIsOpen}
        className="min-h-[70vh] bg-neutral-100 dark:bg-neutral-800"
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src="https://penx.io/images/logo.svg"
              alt="logo"
              className="shadow-popover size-16 rounded-xl"
            />
            <div>
              <Trans>A structured note-taking App</Trans>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
