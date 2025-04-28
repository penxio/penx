'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { useSiteContext } from '@penx/contexts/SiteContext'
// import { SocialNav } from '@penx/components/SocialNav'
import { getBlockClassName } from '@penx/utils'

export const SocialLinksElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const site = useSiteContext()

  return (
    <SlateElement
      {...props}
      className={cn(
        className,
        getBlockClassName(props),
        'm-0 flex h-full items-center justify-center px-0 py-1',
      )}
    >
      {/* <SocialNav site={site as any} size={5} /> */}
      {children}
    </SlateElement>
  )
}
