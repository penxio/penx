'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { useProjectsContext } from '@penx/contexts/ProjectsContext'
import { ProjectsBlock } from './ProjectsBlock'

export const ProjectsElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const projects = useProjectsContext()

  return (
    <SlateElement className={cn(className, 'm-0 px-0 py-1')} {...props}>
      <ProjectsBlock projects={projects} />
      {children}
    </SlateElement>
  )
}
