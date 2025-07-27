import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { actionPopoverAtom } from '~/hooks/useActionPopover'
import { appModeAtom } from '~/hooks/useAppMode'
import { currentCommandAtom } from '~/hooks/useCurrentCommand'
import { navigation } from '~/hooks/useNavigation'
import { searchAtom } from '~/hooks/useSearch'
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

      const navigations = navigation.getNavigation()

      console.log('=======navigations:', navigations)

      if (navigations.length === 1) {
        if (search.length) {
          store.set(searchAtom, '')
        } else {
          console.log('hidel.......')

          window.electron.ipcRenderer.send('hide-panel-window')
        }
      } else {
        if (currentCommand?.id === 'quick-input') {
          unpinWindow()
        }

        navigation.pop()
      }

      // const position = store.get(positionAtom)

      // console.log('======position:', position)

      // if (position === 'ROOT') {
      //   window.electron.ipcRenderer.send('hide-panel-window')
      // } else {
      //   appEmitter.emit('ON_ESCAPE_IN_COMMAND')
      // }
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
