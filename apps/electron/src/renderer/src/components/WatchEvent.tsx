import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { appEmitter } from '@penx/emitter'
import { queryClient } from '@penx/query-client'
import { store } from '@penx/store'

export function WatchEvent() {
  useEffect(() => {
    window.electron.ipcRenderer.on('quick-input-success', () => {
      store.creations.refetchCreations()
    })
  }, [])

  useEffect(() => {
    appEmitter.on('DESKTOP_LOGIN_SUCCESS', async (session) => {
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
      location.reload()
    })
  }, [])

  return null
}
