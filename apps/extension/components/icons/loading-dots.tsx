import { cn } from '@penx/utils'

interface LoadingDotsProps {
  className?: string
}

export const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <span className="penx-dot-loading">
      <span className={cn('bg-background', className)} />
      <span className={cn('bg-background', className)} />
      <span className={cn('bg-background', className)} />
    </span>
  )
}
