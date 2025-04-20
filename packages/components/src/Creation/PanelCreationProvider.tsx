'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { CreationTag, Tag } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import { UpdateCreationInput } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { useCreation } from '@penx/hooks/useCreation'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { CreationById, Panel } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'

export const PanelCreationContext = createContext({} as CreationById)

interface Props {
  creationId: string
  panel: Panel
}

export function usePanelCreationContext() {
  const creation = useContext(PanelCreationContext)
  return creation
}

export const PanelCreationProvider = ({
  creationId,
  panel,
  children,
}: PropsWithChildren<Props>) => {
  const { data, isLoading } = useCreation(creationId)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    appEmitter.on('CREATION_UPDATED', (creation) => {
      setUpdating(true)
      setTimeout(() => {
        setUpdating(false)
      }, 1)
    })
  }, [])

  if (isLoading || panel.isLoading || updating) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <PanelCreationContext.Provider value={data!}>
      {children}
    </PanelCreationContext.Provider>
  )
}
