import { cn } from '@penx/utils'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function Menu({ className, children, onClick }: Props) {
  return (
    <div
      className={cn(
        'divide-foreground/10 rounded-xl bg-white dark:bg-neutral-700',
        'divide-y-[0.5px]',
        className,
      )}
      style={{
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {children}
    </div>
  )
}
