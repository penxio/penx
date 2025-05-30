import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { useLiveQuery, usePGlite } from '@electric-sql/pglite-react'
import { useAtomValue } from 'jotai'
import { isBrowser, isServer, SHAPE_URL } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { useSession } from '@penx/session'
import { appLoadingAtom, store } from '@penx/store'
import { LogoSpinner } from '@penx/widgets/LogoSpinner'
import { runWorker } from '@penx/worker'
import { AppService } from './AppService'
import { WatchNodes } from './WatchNodes'

if (!isServer) {
  runWorker()
}

export const appContext = createContext({} as { app: AppService })

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { session, isLoading } = useSession()
  const loading = useAtomValue(appLoadingAtom)
  const appRef = useRef(new AppService())
  const { Provider } = appContext
  const journalLayout = useJournalLayout()

  const pg = usePGlite()

  const started = useRef(false)

  // console.log('=====data:', data)

  async function sync() {
    const shape = await pg.electric.syncShapeToTable({
      shape: {
        url: SHAPE_URL,
        params: {
          table: 'node',
          where: `"siteId" = '${session.siteId}'`,
        },
      },
      table: 'node',
      primaryKey: ['id'],
      shapeKey: 'node',
    })

    console.log('=======shape:', await shape.stream)
  }

  useEffect(() => {
    if (!session) return
    if (started.current) return
    started.current = true
    sync()
  }, [session])

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

  if (loading || journalLayout.isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LogoSpinner />
      </div>
    )
  }

  return (
    <Provider value={{ app: appRef.current }}>
      {session && <WatchNodes />}
      {children}
    </Provider>
  )
}
