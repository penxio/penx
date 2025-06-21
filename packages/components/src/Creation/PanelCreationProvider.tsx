'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useCreation } from '@penx/hooks/useCreation'
import { ICreationNode } from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { Panel } from '@penx/types'
import { LoadingDots } from '@penx/uikit/loading-dots'

export const PanelCreationContext = createContext({} as Creation)

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
  const { data, isLoading, refetch } = useCreation(creationId)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const handle = (creation: ICreationNode) => {
      setUpdating(true)
      setTimeout(() => {
        setUpdating(false)
      }, 1)
    }
    appEmitter.on('CREATION_UPDATED', handle)
    return () => {
      appEmitter.off('CREATION_UPDATED', handle)
    }
  }, [])

  useEffect(() => {
    const handle = (creation: ICreationNode) => {
      if (panel?.creationId === creation.id) {
        // queryClient.setQueryData(['creations', creation.id], creation)

        setUpdating(true)
        setTimeout(async () => {
          await refetch()
          setUpdating(false)
        }, 1)
      }
    }
    appEmitter.on('PANEL_CREATION_UPDATED', handle)
    return () => {
      appEmitter.off('PANEL_CREATION_UPDATED', handle)
    }
  }, [])

  if (isLoading || panel?.isLoading || updating) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <PanelCreationContext.Provider
      value={data ? new Creation(data!) : (null as any)}
    >
      {children}
    </PanelCreationContext.Provider>
  )
}
