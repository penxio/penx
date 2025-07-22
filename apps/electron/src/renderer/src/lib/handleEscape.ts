import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { actionPopoverAtom } from '~/hooks/useActionPopover'
import { appModeAtom } from '~/hooks/useAppMode'
import { navigation } from '~/hooks/useNavigation'
import { searchAtom } from '~/hooks/useSearch'

export async function handleEscape() {
  document.addEventListener('keydown', async (event) => {
    const search = store.get(searchAtom)

    if (event.key === 'Escape') {
      const isActionPopoverOpen = store.get(actionPopoverAtom)

      if (isActionPopoverOpen) {
        store.set(actionPopoverAtom, false)
        return
      }

      const navigations = navigation.getNavigation()

      if (navigations.length === 1) {
        if (search.length) {
          store.set(searchAtom, '')
        } else {
          window.electron.ipcRenderer.send('hide-panel-window')
        }
      } else {
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
