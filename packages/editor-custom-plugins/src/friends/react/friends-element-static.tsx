'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { useFriendsContext } from '@penx/contexts/FriendsContext'
import { FriendsBlock } from './FriendsBlock'

export const FriendsElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const friends = useFriendsContext()

  return (
    <SlateElement className={cn(className, 'm-0 px-0 py-1')} {...props}>
      <FriendsBlock friends={friends} />
      {children}
    </SlateElement>
  )
}
