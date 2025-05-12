import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { isBrowser, isServer } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { appLoadingAtom, store } from '@penx/store'
import { LogoSpinner } from '@penx/widgets/LogoSpinner'
import { runWorker } from '@penx/worker'
import { AppService } from './AppService'

if (!isServer) {
  runWorker()
}

export const appContext = createContext({} as { app: AppService })

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { session, isLoading } = useSession()
  const loading = useAtomValue(appLoadingAtom)
  const appRef = useRef(new AppService())
  const { Provider } = appContext

  useEffect(() => {
    if (isLoading) return
    if (!appRef.current.inited) {
      appRef.current.init(session)
    }
  }, [isLoading, session])

  useEffect(() => {
    appEmitter.on('APP_LOGIN_SUCCESS', (session) => {
      appRef.current.init(session)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LogoSpinner />
      </div>
    )
  }

  return <Provider value={{ app: appRef.current }}>{children}</Provider>
}
