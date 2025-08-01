import { BrowserWindow } from 'electron'

export type Windows = {
  mainWindow: BrowserWindow | null
  panelWindow: BrowserWindow | null
  aiCommandWindow: BrowserWindow | null
}
