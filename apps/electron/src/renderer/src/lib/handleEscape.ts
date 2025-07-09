import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { appModeAtom } from '~/hooks/useAppMode'
import { positionAtom } from '~/hooks/useCommandPosition'

export async function handleEscape() {
  document.addEventListener('keydown', async (event) => {
    const mode = store.get(appModeAtom)

    if (event.key === 'Escape') {
      const position = store.get(positionAtom)
      if (position === 'ROOT') {
        window.electron.ipcRenderer.send('close')
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
