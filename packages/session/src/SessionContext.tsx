'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { useQuerySession } from './useQuerySession'

type SessionType = ReturnType<typeof useQuerySession>

export const SessionContext = createContext({} as SessionType)

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const sessionRes = useQuerySession()

  return (
    <SessionContext.Provider value={sessionRes}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
