import { useCallback, useEffect, useRef } from 'react'
import { set } from 'idb-keyval'
import { api } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { useAppShortcuts } from '@penx/hooks/useAppShortcuts'
import {
  getAddress,
  getNewMnemonic,
  getPublicKey,
  setMnemonicToLocal,
} from '@penx/mnemonic'
import { queryClient } from '@penx/query-client'
import { refreshSession, useSession } from '@penx/session'
import { store } from '@penx/store'
import { openCommand } from '~/lib/openCommand'

window.customElectronApi.shortcut.onPressed((shortcut) => {
  window.customElectronApi.togglePanelWindow()
  openCommand({
    id: shortcut.commandId,
  })
})

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

  const { shortcuts } = useAppShortcuts()
  const registered = useRef(false)

  function registerShortcuts() {
    for (const item of shortcuts) {
      // console.log('=============shortcut:', item)
      window.customElectronApi.shortcut.unregister(item)
      window.customElectronApi.shortcut.register(item)
    }
  }

  useEffect(() => {
    if (registered.current) return
    registered.current = true
    // console.log('===========shortcuts:', shortcuts)
    registerShortcuts()
  }, [])

  const { session } = useSession()
  const doingRef = useRef(false)
  const initMnemonic = useCallback(async () => {
    try {
      const mnemonic = await getNewMnemonic()
      const publicKey = getPublicKey(mnemonic)
      const address = getAddress(mnemonic)
      await api.updateMnemonicInfo({
        mnemonic,
        publicKey,
        address,
      })
      await setMnemonicToLocal(session.spaceId!, mnemonic)
      // store.user.setMnemonic(mnemonic)
      refreshSession()
    } catch (error) {
      console.log('=====error:', error)
    }
  }, [session])

  useEffect(() => {
    if (!session || session.publicKey || doingRef.current) return
    console.log('init=======session:', session)
    doingRef.current = true
    initMnemonic()
  }, [session])

  return null
}
