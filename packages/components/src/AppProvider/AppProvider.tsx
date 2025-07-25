import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { isBrowser, isServer } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { useSession } from '@penx/session'
import {
  appErrorAtom,
  appLoadingAtom,
  appPasswordNeededAtom,
  store,
} from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { LogoSpinner } from '@penx/widgets/LogoSpinner'
import { runWorker } from '@penx/worker'
import { RecoverPassword } from '../RecoverPassword'
import { AppService } from './AppService'

if (!isServer) {
  setTimeout(() => {
    runWorker()
  }, 5000)
}

export const appContext = createContext({} as { app: AppService })

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { session, isLoading } = useSession()
  const loading = useAtomValue(appLoadingAtom)
  const passwordNeed = useAtomValue(appPasswordNeededAtom)
  const error = useAtomValue(appErrorAtom)
  const appRef = useRef(new AppService())
  const { Provider } = appContext
  const journalLayout = useJournalLayout()

  useEffect(() => {
    if (isLoading) return
    if (!appRef.current.inited) {
      appRef.current.init(session)
    }
  }, [isLoading, session])

  useEffect(() => {
    function handleInit(session: any) {
      appRef.current.init(session)
    }
    appEmitter.on('APP_LOGIN_SUCCESS', handleInit)
    appEmitter.on('DELETE_ACCOUNT', handleInit)

    return () => {
      appEmitter.off('APP_LOGIN_SUCCESS', handleInit)
      appEmitter.off('DELETE_ACCOUNT', handleInit)
    }
  }, [])

  if (error) {
    return (
      <div className="text-foreground/60 flex h-screen items-center justify-center text-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <div>{error}</div>
          <div>
            <Button
              onClick={() => {
                appRef.current.init(session)
              }}
            >
              Reload App
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (passwordNeed) {
    return <RecoverPassword />
  }

  if (loading || journalLayout.isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LogoSpinner />
      </div>
    )
  }

  return <Provider value={{ app: appRef.current }}>{children}</Provider>
}
