import { ReactNode } from 'react'
import { cn } from '@penx/utils'

interface Props {
  title?: ReactNode
  className?: string
  children?: React.ReactNode
}

export function Menu({ className, title, children }: Props) {
  const content = (
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
  if (title) {
    return (
      <div className="space-y-1">
        <div className="text-foreground/50 text-sm">{title}</div>
        {content}
      </div>
    )
  }
  return content
}
