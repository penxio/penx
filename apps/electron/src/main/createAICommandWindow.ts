import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, screen, shell } from 'electron'
import icon from '../../resources/icon.png?asset'

export function createAICommandWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height: screenHeight } = primaryDisplay.workAreaSize

  const barHeight = 28
  // Create the browser window.
  const aiCommandWindow = new BrowserWindow({
    width: 260,
    height: 500,

    autoHideMenuBar: true,
    // titleBarStyle: 'hidden',
    show: false,
    frame: false,
    vibrancy: process.platform === 'darwin' ? 'hud' : undefined,
    transparent: process.platform === 'darwin',
    alwaysOnTop: true,
    skipTaskbar: true,
    // resizable: false,
    resizable: true,

    movable: true,
    focusable: true,

    // movable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      partition: 'persist:sharedPartition',
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  aiCommandWindow.setAlwaysOnTop(true, 'floating')

  aiCommandWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  //   mainWindow.webContents.openDevTools()
  // })
  aiCommandWindow.on('show', () => {
    // mainWindow.webContents.openDevTools()
  })

  aiCommandWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    aiCommandWindow.loadURL(
      `${process.env['ELECTRON_RENDERER_URL']}/ai-command`,
    )
  } else {
    aiCommandWindow.loadFile(join(__dirname, '../renderer/ai-command.html'))
  }
  return aiCommandWindow
}
