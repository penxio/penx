import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, screen, shell } from 'electron'
import icon from '../../resources/icon.png?asset'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

export function createPanelWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height: screenHeight } = primaryDisplay.workAreaSize

  const barHeight = 28
  // Create the browser window.
  const panelWindow = new BrowserWindow({
    width: 750,
    height: 500,
    // width: 100,
    // height: barHeight,
    // show: true,
    // x: 100,
    // y: screenHeight - barHeight,

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

  // panelWindow.showInactive()
  panelWindow.setAlwaysOnTop(true, 'floating')

  panelWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  //   mainWindow.webContents.openDevTools()
  // })
  panelWindow.on('show', () => {
    // mainWindow.webContents.openDevTools()
  })

  panelWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    panelWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/panel`)
  } else {
    panelWindow.loadFile(join(__dirname, '../renderer/panel.html'))
  }
  return panelWindow
}
