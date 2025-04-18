'use client'

import React from 'react'
import { cn, withRef } from '@udecode/cn'
import type { TLinkElement } from '@udecode/plate-link'
import { useLink } from '@udecode/plate-link/react'
import { PlateElement } from '@udecode/plate/react'
import { ArrowUpRight } from 'lucide-react'

export const LinkElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = props.element as TLinkElement
    const { props: linkProps } = useLink({ element })

    return (
      <PlateElement
        ref={ref}
        as="a"
        target="_blank"
        className={cn(
          className,
          'text-brand decoration-brand  inline-flex font-medium underline-offset-4',
        )}
        {...(linkProps as any)}
        {...props}
      >
        {children}
        <ArrowUpRight size={16} className="mt-0.5" />
      </PlateElement>
    )
  },
)
