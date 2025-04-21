import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { ArrowUpRight } from 'lucide-react'

export const LinkElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  ;(props as any).target = '_blank'
  return (
    <SlateElement
      as="a"
      className={cn(
        className,
        'text-brand decoration-brand inline-flex font-medium underline-offset-4 transition-all hover:scale-105',
      )}
      {...props}
    >
      {children}
      <ArrowUpRight size={16} className="mt-0.5" />
    </SlateElement>
  )
}
