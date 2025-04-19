'use client'

import { ReactNode } from 'react'
import { usePathname } from '@/lib/i18n'
import { cn } from '@penx/utils'

// import { usePathname } from 'next/navigation'

interface Props {
  children: ReactNode
  className?: string
}

export default function SectionContainer({ children, className }: Props) {
  const pathname = usePathname()!

  return (
    <section
      className={cn(
        'mx-auto flex min-h-screen w-full flex-col px-4 sm:px-6 xl:px-0',
        pathname === '/' && 'bg-foreground/5',
        className,
      )}
    >
      {children}
    </section>
  )
}
