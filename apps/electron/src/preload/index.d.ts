import { ElectronAPI } from '@electron-toolkit/preload'
import { clipboard, contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    electron: ElectronAPI
    customElectronApi: {
      clipboard: Electron.Clipboard
      toggleMainWindow: () => void
      togglePanelWindow: () => void
      toggleInputWindow: () => void
      shortcut: {
        register: (shortcut: Shortcut) => any
        unregister: (shortcut: Shortcut) => any
        onPressed: (callback: (acc: string) => void) => void
      }
    }
  }
}
