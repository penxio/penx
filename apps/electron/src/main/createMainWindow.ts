import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, screen, shell } from 'electron'
import icon from '../../resources/icon.png?asset'

export function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height: screenHeight } = primaryDisplay.workAreaSize

  const barHeight = 28
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 30,
    },
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon,
    webPreferences: {
      partition: 'persist:sharedPartition',
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return mainWindow
}
