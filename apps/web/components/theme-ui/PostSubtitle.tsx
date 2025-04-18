import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export function PostSubtitle({ children, className }: Props) {
  return (
    <p className={cn('text-foreground/50 text-lg', className)}>{children}</p>
  )
}
