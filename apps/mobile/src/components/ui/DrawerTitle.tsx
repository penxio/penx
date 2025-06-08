import { cn } from '@penx/utils'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function DrawerTitle({ className, children }: Props) {
  return (
    <div
      className={cn(
        'text-foreground text-center text-base font-semibold',
        className,
      )}
    >
      {children}
    </div>
  )
}
