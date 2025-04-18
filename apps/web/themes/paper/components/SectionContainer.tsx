import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export default function SectionContainer({ children, className }: Props) {
  return (
    <section
      className={cn(
        'bg-foreground/5 mx-auto flex min-h-screen flex-col px-4 sm:px-6 xl:px-0',
        className,
      )}
    >
      {children}
    </section>
  )
}
