'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import sdk, { FrameContext as FrameContextType } from '@farcaster/frame-sdk'
import { useQuery } from '@tanstack/react-query'

export const FrameContext = createContext({} as FrameContextType)

interface Props {}

export const FrameProvider = ({ children }: PropsWithChildren<Props>) => {
  const { data } = useQuery({
    queryKey: ['frame-context'],
    queryFn: async () => {
      try {
        let context = await sdk.context

        await sdk.actions.ready()

        return context || (null as any)
      } catch (error) {
        console.log('error:', error)
        return undefined as any
      }
    },
  })

  return (
    <FrameContext.Provider value={data as any}>
      {children}
    </FrameContext.Provider>
  )
}

export function useFrameContext() {
  return useContext(FrameContext)
}
