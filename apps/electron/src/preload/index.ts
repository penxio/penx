import { electronAPI } from '@electron-toolkit/preload'
import { app, clipboard, contextBridge, ipcRenderer } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Shortcut } from '@penx/model-type'
import pkg from '../../package.json'

// Custom APIs for renderer
const api = {
  clipboard: clipboard,
  shortcut: {
    register: (shortcut: Shortcut) =>
      ipcRenderer.invoke('register-shortcut', shortcut),
    unregister: (shortcut: Shortcut) =>
      ipcRenderer.invoke('unregister-shortcut', shortcut),
    onPressed: (callback: (acc: Shortcut) => void) =>
      ipcRenderer.on('shortcut-pressed', (_event, acc) => callback(acc)),
  },
  toggleMainWindow: () => ipcRenderer.send('toggle-main-window'),
  togglePanelWindow: () => ipcRenderer.send('toggle-panel-window'),
  toggleAICommandWindow: () => ipcRenderer.send('toggle-ai-command-window'),
  openPanelWindow: () => ipcRenderer.send('open-panel-window'),
  getAppInfo: {
    version: pkg?.version,
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('customElectronApi', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.customElectronApi = api
}
