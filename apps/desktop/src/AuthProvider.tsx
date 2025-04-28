import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { appEmitter } from '@penx/emitter'
import { queryClient } from '@penx/query-client'
import { SessionContext, useQuerySession, useSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Login } from './Login'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const res = useQuerySession()
  useEffect(() => {
    appEmitter.on('DESKTOP_LOGIN_SUCCESS', async (session) => {
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
    })
  }, [])

  if (res.isLoading) return <LoadingDots />
  if (!res.session) return <Login />
  return (
    <SessionContext.Provider value={res}>{children}</SessionContext.Provider>
  )
}
