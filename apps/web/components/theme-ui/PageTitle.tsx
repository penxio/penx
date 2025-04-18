import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'mb-10 mt-12 text-3xl font-bold leading-tight tracking-tight md:text-[42px]',
        className,
      )}
    >
      {children}
    </h1>
  )
}
