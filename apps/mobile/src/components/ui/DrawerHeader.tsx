import { Trans } from '@lingui/react/macro'
import { cn } from '@penx/utils'
import { useDrawerContext } from './DrawerContext'

interface Props {
  className?: string
  children?: React.ReactNode
  showCancelButton?: boolean
  disabled?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export function DrawerHeader({
  className,
  children,
  showCancelButton = false,
  disabled,
  onConfirm,
  onCancel,
}: Props) {
  const { setOpen } = useDrawerContext()
  return (
    <div
      className={cn(
        'text-foreground sticky top-0 -mx-4 mb-2 flex h-12 shrink-0 items-center justify-between bg-neutral-100 px-4  text-base font-semibold outline-none dark:bg-neutral-800',
        className,
      )}
    >
      <div className="inline-flex w-24">
        {showCancelButton && (
          <div
            className="text-foreground/60 font-light"
            onClick={() => {
              setOpen(false)
              onCancel?.()
            }}
          >
            <Trans>Cancel</Trans>
          </div>
        )}
      </div>

      {children}

      <div className="inline-flex w-24 justify-end">
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
