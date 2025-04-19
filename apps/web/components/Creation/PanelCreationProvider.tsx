'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useCollaborators } from '@/hooks/useCollaborators'
import { Creation, useCreation } from '@/hooks/useCreation'
import { useSiteTags } from '@/hooks/useSiteTags'
import { appEmitter } from '@/lib/app-emitter'
import { UpdateCreationInput } from '@/lib/constants/schema.constants'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { Panel } from '@/lib/types'
import { CreationTag, Tag } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash.debounce'

export const PanelCreationContext = createContext({} as Creation)

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
