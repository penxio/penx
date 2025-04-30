import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { appLoadingAtom, store } from '@penx/store'
import { LogoSpinner } from '@penx/widgets/LogoSpinner'
import { AppService } from './AppService'

export const appContext = createContext({} as { app: AppService })

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const loading = useAtomValue(appLoadingAtom)
  const appRef = useRef(new AppService())
  const { Provider } = appContext

  useEffect(() => {
    if (!appRef.current.inited) {
      appRef.current.init()
    }
  }, [])

  // const inited = useRef(false)
  // useEffect(() => {
  //   if (inited.current) return
  //   inited.current = true
  // }, [])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LogoSpinner />
      </div>
    )
  }

  return <Provider value={{ app: appRef.current }}>{children}</Provider>
}
