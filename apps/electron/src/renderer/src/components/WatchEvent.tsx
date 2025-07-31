import { useCallback, useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'
import { set } from 'idb-keyval'
import { toast } from 'sonner'
import { tinykeys } from 'tinykeys'
import { api } from '@penx/api'
import {
  settingsAtom,
  SettingsNav,
} from '@penx/components/SettingsDialog/useSettingsDialog'
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
import { syncNodesToServer } from '@penx/worker/lib/syncNodesToServer'
import { openCommand } from '~/lib/openCommand'

tinykeys(window, {
  // '$mod+Alt+KeyS': (event) => {
  //   event.preventDefault()
  //   toast.promise(
  //     async () => {
  //       await syncNodesToServer()
  //     },
  //     {
  //       loading: t`Syncing...`,
  //       success: t`Sync successful!`,
  //       error: () => {
  //         return t`Sync failed, please try again.`
  //       },
  //     },
  //   )
  // },
})

window.customElectronApi.shortcut.onPressed((shortcut) => {
  // console.log('=========shortcut:', shortcut)

  if (shortcut.commandId) {
    window.customElectronApi.togglePanelWindow()
    openCommand({
      id: shortcut.commandId,
    })
  }
})

window.electron.ipcRenderer.on('edit-shortcuts', () => {
  openCommand({
    id: 'settings',
  })

  store.set(settingsAtom, {
    open: true,
    navName: SettingsNav.EDIT_SHORTCUTS,
  })
})

window.electron.ipcRenderer.on('translate', (_, text) => {
  if (!text) return
  window.customElectronApi.openPanelWindow()
  openCommand({
    id: 'translate',
    data: {
      text,
    },
  })
})

export function WatchEvent() {
  useEffect(() => {
    window.electron.ipcRenderer.on('quick-input-success', () => {
      store.creations.refetchCreations()
    })
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on('quit-and-install', () => {
      toast.loading(t`New version available, restarting to update...`)
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
