import type { ElectronAPI } from '@electron-toolkit/preload'
import type Electron from 'electron'
import type { Shortcut } from '@penx/types'

/// <reference types="vite-plugin-svgr/client" />
declare module 'shikwasa'

declare global {
  interface Window {
    electron: ElectronAPI
    customElectronApi: {
      clipboard: Electron.Clipboard
      toggleMainWindow: () => void
      togglePanelWindow: () => void
      openPanelWindow: () => void
      shortcut: {
        register: (shortcut: Shortcut) => any
        unregister: (shortcut: Shortcut) => any
        onPressed: (callback: (acc: Shortcut) => void) => void
      }
    }
    __SITE__: any
    __SITE_ID__: string
    __USER_ID__: string
    __PLAYER__: any
  }
}
