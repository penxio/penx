import { useEffect } from 'react'
import { storage } from '@/lib/storage'
import { browser, storage as wxtStorage } from '#imports'
import { set } from 'idb-keyval'
import { Panel } from '@penx/panel-app/components/Panel/Panel'
import { useSession } from '@penx/session'
import { HealthCheck } from './HealthCheck'

function App() {
  return (
    <HealthCheck>
      <Panel location="sidepanel" defaultTheme="light">
        <WatchSession></WatchSession>
      </Panel>
    </HealthCheck>
  )
}

function WatchSession(): null {
  const { refetch } = useSession()
  useEffect(() => {
    const unwatchSession = wxtStorage.watch<number>(
      storage.keys.session,
      async (newValue, oldValue) => {
        await set('SESSION', newValue)

        refetch()
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
