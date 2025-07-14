import { useEffect } from 'react'
import { store } from '@penx/store'

export function WatchEvent() {
  useEffect(() => {
    window.electron.ipcRenderer.on('quick-input-success', () => {
      store.creations.refetchCreations()
    })
  }, [])

  return null
}
