import { createContext, useContext } from 'react'

export interface SessionContextValue {
  loading: boolean
}

export const sessionContext = createContext<SessionContextValue>({
  data: null,
  loading: true,
} as any)

export const SessionProvider = sessionContext.Provider

export function useSession() {
  return useContext(sessionContext)
}
