import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { cn } from '@penx/utils'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function StructsMenu({ children, className }: ItemProps) {
  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={() => {
          appEmitter.emit('ROUTE_TO_ALL_STRUCTS', true)
        }}
      >
        <div className="font-medium">
          <Trans>Structs</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>
    </>
  )
}
