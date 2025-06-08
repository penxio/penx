import { cn } from '@penx/utils'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function Menu({ className, children }: Props) {
  return (
    <div
      className={cn(
        'divide-foreground/10 rounded-xl bg-white dark:bg-neutral-700',
        devicePixelRatio >= 3 ? 'divide-y' : 'divide-y-[0.5px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
