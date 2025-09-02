import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { isBrowser, isDesktop, isServer } from '@penx/constants'
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
import { DesktopLogin } from '../DesktopLogin'
import { DesktopWelcome } from '../DesktopWelcome'
import { EarlyAccessCode } from '../EarlyAccessCode'
import { RecoverPassword } from '../RecoverPassword'
import { AppService } from './AppService'

if (!isServer) {
  setTimeout(() => {
    runWorker()
  }, 5000)
}

export const appContext = createContext({} as { app: AppService })

const appService = new AppService()

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { session, isLoading } = useSession()
  const loading = useAtomValue(appLoadingAtom)
  const passwordNeed = useAtomValue(appPasswordNeededAtom)
  const error = useAtomValue(appErrorAtom)
  // const appRef = useRef(new AppService())
  const inited = useRef(false)
  const { Provider } = appContext
  const journalLayout = useJournalLayout()

  const {
    isLoading: isBoardedLoading,
    data: isBoarded,
    refetch,
  } = useQuery({
    queryKey: ['isFistTime'],
    queryFn: async () => {
      const isBoarded = localStorage.getItem('PENX_IS_BOARDED')
      return !!isBoarded
    },
  })

  console.log('===============>>>>>loading:', loading)

  useEffect(() => {
    if (isLoading) return
    if (inited.current) return
    inited.current = true
    if (!appService.inited) {
      console.log('helo......>>>>>>>>>')
      appService.init(session)
    }
  }, [isLoading, session])

  useEffect(() => {
    function handleInit(session: any) {
      appService.init(session)
    }
    appEmitter.on('APP_LOGIN_SUCCESS', handleInit)
    appEmitter.on('DESKTOP_LOGIN_SUCCESS', handleInit)
    appEmitter.on('DELETE_ACCOUNT', handleInit)

    return () => {
      appEmitter.off('APP_LOGIN_SUCCESS', handleInit)
      appEmitter.off('DELETE_ACCOUNT', handleInit)
      appEmitter.off('DESKTOP_LOGIN_SUCCESS', handleInit)
    }
  }, [])

  if (error) {
    return (
      <div className="text-foreground/60 drag flex h-screen items-center justify-center text-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <div>{error}</div>
          <div>
            <Button
              className="no-drag"
              onClick={() => {
                appService.init(session)
              }}
            >
              Reload App
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return null

  if (!session && isDesktop) {
    return <DesktopLogin />
  }

  if (session && !session?.earlyAccessCode) {
    return <EarlyAccessCode />
  }

  if (passwordNeed) {
    return <RecoverPassword />
  }

  if (loading || isBoardedLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LogoSpinner />
      </div>
    )
  }

  if (!isBoarded && isDesktop) {
    return (
      <DesktopWelcome isLoading={isBoardedLoading} onGetStarted={refetch} />
    )
  }

  return <Provider value={{ app: appService }}>{children}</Provider>
}
