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
        'mx-auto flex h-screen w-full flex-col px-4 sm:px-6 xl:px-0',
        className,
      )}
    >
      {children}
    </section>
  )
}
