import { useEffect } from 'react'
import { storage } from '@/lib/storage'
import { browser, storage as wxtStorage } from '#imports'
import { set } from 'idb-keyval'
import { appEmitter } from '@penx/emitter'
import { Panel } from '@penx/panel-app/components/Panel/Panel'
import { useSession } from '@penx/session'
import { HealthCheck } from './HealthCheck'

function App() {
  return (
    <HealthCheck>
      <WatchSession></WatchSession>
      <Panel location="sidepanel" defaultTheme="light"></Panel>
    </HealthCheck>
  )
}

function WatchSession(): null {
  console.log('>>>>>>>>>>>>>WatchSession:.......')

  useEffect(() => {
    const unwatchSession = wxtStorage.watch<number>(
      storage.keys.session,
      async (newValue, oldValue) => {
        appEmitter.emit('SESSION_CHANGED', newValue)

        console.log(
          '>>>>>>======session changed',
          newValue,
          'oldValue:',
          oldValue,
        )
      },
    )

    return () => {
      unwatchSession()
    }
  }, [])
  return null
}

export default App
