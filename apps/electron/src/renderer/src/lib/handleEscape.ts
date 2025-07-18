import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { actionPopoverAtom } from '~/hooks/useActionPopover'
import { appModeAtom } from '~/hooks/useAppMode'
import { positionAtom } from '~/hooks/useCommandPosition'

export async function handleEscape() {
  document.addEventListener('keydown', async (event) => {
    const mode = store.get(appModeAtom)

    if (event.key === 'Escape') {
      const isActionPopoverOpen = store.get(actionPopoverAtom)

      if (isActionPopoverOpen) {
        store.set(actionPopoverAtom, false)
        return
      }

      const position = store.get(positionAtom)

      console.log('======position:', position)

      if (position === 'ROOT') {
        window.electron.ipcRenderer.send('hide-panel-window')
      } else {
        appEmitter.emit('ON_ESCAPE_IN_COMMAND')
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
