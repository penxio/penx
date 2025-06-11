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
          'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
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
              // src="assets/logo-dark.png"
              src="https://penx.io/logo.png"
              alt="logo"
              className="size-16 rounded-xl"
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
