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
import { isDesktop } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useAppShortcuts } from '@penx/hooks/useAppShortcuts'
import { localDB } from '@penx/local-db'
import {
  getAddress,
  getNewMnemonic,
  getPublicKey,
  setMnemonicToLocal,
} from '@penx/mnemonic'
import { queryClient } from '@penx/query-client'
import { refreshSession, useSession } from '@penx/session'
import { store } from '@penx/store'
import { currentCommandAtom } from '../hooks/useCurrentCommand'
import { currentCreationAtom } from '../hooks/useCurrentCreation'
import { navigation, setNavigations } from '../hooks/useNavigation'
import { usePanel } from '../hooks/usePanel'
import { Selection } from '../hooks/useSelection'
import { creationToCommand } from '../lib/creationToCommand'
import { openCommand } from '../lib/openCommand'

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

if (isDesktop) {
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

  window.electron.ipcRenderer.on('open-chat-to-browser', (_, text) => {
    console.log('=========open-chat-to-browser...')
    openCommand({
      id: 'chat-to-browser',
    })
  })

  window.electron.ipcRenderer.on('open-quick-input', () => {
    openCommand({
      id: 'quick-input',
    })

    setTimeout(() => {
      window.customElectronApi.openPanelWindow()
    }, 0)
  })

  window.electron.ipcRenderer.on('open-window-after-subscription', () => {
    console.log('name......')
    refreshSession()
  })

  window.electron.ipcRenderer.on(
    'open-ai-command',
    async (
      _,
      { creationId, selection }: { creationId: string; selection: Selection },
    ) => {
      const creation = await localDB.getCreation(creationId)

      store.set(currentCreationAtom, creation)
      store.set(currentCommandAtom, creationToCommand(new Creation(creation)))
      navigation.push({
        path: '/ai-command',
        data: selection,
      })

      setTimeout(() => {
        window.customElectronApi.openPanelWindow()
      }, 0)
    },
  )
}

export function WatchEvent() {
  useEffect(() => {
    if (isDesktop) {
      window.electron.ipcRenderer.on('quick-input-success', () => {
        store.creations.refetchCreations()
      })
    }
  }, [])

  useEffect(() => {
    if (isDesktop) {
      window.electron.ipcRenderer.on('quit-and-install', () => {
        toast.loading(t`New version available, restarting to update...`)
      })
    }
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
      if (isDesktop) {
        window.customElectronApi.shortcut.unregister(item)
        window.customElectronApi.shortcut.register(item)
      }
    }
  }

  useEffect(() => {
    if (registered.current) return
    registered.current = true
    // console.log('===========shortcuts:', shortcuts)
    if (isDesktop) {
      registerShortcuts()
    }
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
