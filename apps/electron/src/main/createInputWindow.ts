import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, screen, shell } from 'electron'
import icon from '../../resources/icon.png?asset'

export function createInputWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height: screenHeight } = primaryDisplay.workAreaSize

  const barHeight = 28
  // Create the browser window.
  const inputWindow = new BrowserWindow({
    width: 400,
    height: 300,
    // width: 100,
    // height: barHeight,
    // show: true,
    // x: 100,
    // y: screenHeight - barHeight,

    autoHideMenuBar: true,
    // titleBarStyle: 'hidden',
    show: false,
    frame: false,
    vibrancy: 'hud',
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    // resizable: false,
    resizable: true,

    movable: true,
    // focusable: false,

    // movable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      partition: 'persist:sharedPartition',
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  inputWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  //   mainWindow.webContents.openDevTools()
  // })
  inputWindow.on('show', () => {
    inputWindow.webContents.send('input-window-show')
    // inputWindow.webContents.openDevTools()
  })

  inputWindow.on('close', () => {
    // inputWindow.webContents.openDevTools()
  })

  inputWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    inputWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/input`)
  } else {
    inputWindow.loadFile(join(__dirname, '../renderer/input.html'))
  }
  return inputWindow
}
