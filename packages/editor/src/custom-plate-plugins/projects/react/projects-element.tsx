'use client'

import React from 'react'
import { Button } from '@penx/uikit/ui/button'
import { Link } from '@penx/libs/i18n'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'

export const ProjectsElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props

  return (
    <PlateElement
      ref={ref}
      className={cn(className)}
      {...props}
      contentEditable={false}
    >
      <div className="bg-background border-foreground/5 text-foreground/60 flex h-20 items-center justify-center gap-2 rounded-2xl border p-4">
        <div>My Projects</div>
        <Link href="/~/settings/projects">
          <Button size="sm" variant="secondary">
            Edit
          </Button>
        </Link>
      </div>
      {children}
    </PlateElement>
  )
})
