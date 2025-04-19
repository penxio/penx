import { cn } from '@penx/utils'
import styles from './loading-dots.module.css'

interface LoadingDotsProps {
  className?: string
}

export const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <span className={styles.loading}>
      <span className={cn('bg-background', className)} />
      <span className={cn('bg-background', className)} />
      <span className={cn('bg-background', className)} />
    </span>
  )
}
