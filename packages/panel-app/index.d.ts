import { JSX, ReactNode } from 'react'
import { ElectronAPI } from '@electron-toolkit/preload'
import type { NodeModelApi } from '@penx/local-db'
import type { Shortcut } from '@penx/model-type'

type Navigation = {
  showHeader?: boolean
  path: string
  component?: (() => ReactNode) | (() => JSX.Element)
  data?: Record<string, any>
}

// declare module 'tinykeys'

declare global {
  interface Window {
    nodeModelApi: NodeModelApi
    navigations: Navigation[]
    electron: ElectronAPI
    customElectronApi: {
      toggleMainWindow: () => void
      togglePanelWindow: () => void
      openPanelWindow: () => void
      getAppInfo: {
        version: string
      }
      shortcut: {
        register: (shortcut: Shortcut) => any
        unregister: (shortcut: Shortcut) => any
        onPressed: (callback: (acc: Shortcut) => void) => void
      }
    }
  }
}
