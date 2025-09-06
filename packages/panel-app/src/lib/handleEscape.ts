import { isDesktop } from '@penx/constants'
import { store } from '@penx/store'
import { actionPopoverAtom } from '../hooks/useActionPopover'
import { currentCommandAtom } from '../hooks/useCurrentCommand'
import { navigation } from '../hooks/useNavigation'
import { searchAtom } from '../hooks/useSearch'
import { unpinWindow } from './pinned'

export async function handleEscape() {
  document.addEventListener('keydown', async (event) => {
    const search = store.get(searchAtom)
    const currentCommand = store.get(currentCommandAtom)

    if (event.key === 'Escape') {
      const isActionPopoverOpen = store.get(actionPopoverAtom)

      if (isActionPopoverOpen) {
        store.set(actionPopoverAtom, false)
        return
      }

      const navigations = navigation.getNavigations()

      // console.log('=======navigations:', navigations)

      if (navigations.length === 1) {
        console.log('=======navigations:', navigations)

        if (search.length) {
          store.set(searchAtom, '')
        } else {
          isDesktop && window.electron.ipcRenderer.send('hide-panel-window')
        }
      } else {
        if (currentCommand?.id === 'quick-input') {
          unpinWindow()
        }

        navigation.pop()
      }
    }
  })

  // listen('tauri://blur', () => {
  //   if (!isDev) {
  //     const mode = store.get(appModeAtom)
  //     if (mode === 'COMMAND') {
  //       appWindow.hide()
  //     }
  //   }
  // })
}
