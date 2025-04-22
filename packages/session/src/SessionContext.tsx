'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { useGetSession } from './session'

type SessionType = ReturnType<typeof useGetSession>

export const SessionContext = createContext({} as SessionType)

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const sessionRes = useGetSession()

  return (
    <SessionContext.Provider value={sessionRes}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
