import { ElectronAPI } from '@electron-toolkit/preload'

/// <reference types="vite-plugin-svgr/client" />
declare module 'shikwasa'

declare global {
  interface Window {
    electron: ElectronAPI
    __SITE__: any
    __SITE_ID__: string
    __USER_ID__: string
    __PLAYER__: any
  }
}
