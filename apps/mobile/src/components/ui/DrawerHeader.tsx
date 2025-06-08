import { Trans } from '@lingui/react/macro'
import { cn } from '@penx/utils'
import { useDrawerContext } from './DrawerContext'

interface Props {
  className?: string
  children?: React.ReactNode
  showCancelButton?: boolean
  disabled?: boolean
  onConfirm?: () => void
}

export function DrawerHeader({
  className,
  children,
  showCancelButton = false,
  disabled,
  onConfirm,
}: Props) {
  const { setOpen } = useDrawerContext()
  return (
    <div
      className={cn(
        'text-foreground h-13 -mx-4 mb-2 flex items-center justify-between px-4 text-base font-semibold',
        className,
      )}
    >
      <div className="inline-flex">
        {showCancelButton && (
          <div
            className="text-foreground/60 font-light"
            onClick={() => {
              setOpen(false)
            }}
          >
            <Trans>Cancel</Trans>
          </div>
        )}
      </div>

      {children}

      <div className="inline-flex">
        {onConfirm && (
          <div
            className={cn(
              'text-brand font-semibold',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={() => {
              onConfirm?.()
            }}
          >
            <Trans>Save</Trans>
          </div>
        )}
      </div>
    </div>
  )
}
