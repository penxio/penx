import { ElectronAPI } from '@electron-toolkit/preload'
import { clipboard, contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    electron: ElectronAPI
    customElectronApi: {
      clipboard: Electron.Clipboard
    }
  }
}
