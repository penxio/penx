'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Project } from '@penx/types'

export const ProjectsContext = createContext({} as Project[])

interface Props {
  projects: Project[]
}

export const ProjectsProvider = ({
  projects,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjectsContext() {
  const friends = useContext(ProjectsContext)
  return friends
}
