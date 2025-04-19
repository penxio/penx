'use client'

import React from 'react'
import { Button } from '@penx/ui/components/button'
import { Link } from '@/lib/i18n'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'

export const FriendsElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props

  return (
    <PlateElement
      ref={ref}
      className={cn(className)}
      {...props}
      contentEditable={false}
    >
      <div className="border-foreground/5 text-foreground/60 bg-background flex h-20 items-center justify-center gap-2 rounded-2xl border p-4">
        <div>Friend links</div>
        <Link href="/~/settings/friends">
          <Button size="sm" variant="secondary">
            Edit
          </Button>
        </Link>
      </div>
      {children}
    </PlateElement>
  )
})
