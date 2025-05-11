'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import { UpdateCreationInput } from '@penx/constants'
import { CreationTag, Tag } from '@penx/db/client'
import { appEmitter } from '@penx/emitter'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { useCreation } from '@penx/hooks/useCreation'
import { ICreation } from '@penx/model-type/ICreation'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { Panel } from '@penx/types'
import { LoadingDots } from '@penx/uikit/loading-dots'

export const PanelCreationContext = createContext({} as ICreation)

interface Props {
  panel?: Panel
  creationId: string
}

export function usePanelCreationContext() {
  const creation = useContext(PanelCreationContext)
  return creation
}

export const PanelCreationProvider = ({
  panel,
  creationId,
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

  if (isLoading || panel?.isLoading || updating) {
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
