import { ReactNode } from 'react'
import { cn } from '@penx/utils'

interface Props {
  children: ReactNode
  className?: string
}

export default function SectionContainer({ children, className }: Props) {
  return (
    <section
      className={cn(
        'mx-auto flex min-h-screen flex-col px-4 sm:px-6 lg:max-w-5xl xl:px-0',
        className,
      )}
    >
      {children}
    </section>
  )
}
