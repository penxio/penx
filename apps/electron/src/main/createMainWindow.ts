import { shell, BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

export function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height: screenHeight } = primaryDisplay.workAreaSize

  const barHeight = 28
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 600,
    // width: 100,
    // height: barHeight,
    // show: true,
    // x: 100,
    // y: screenHeight - barHeight,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 30
    },
    ...(process.platform === 'linux' ? { icon } : {}),

    // frame: false,
    // frame: true,
    // transparent: true,
    // alwaysOnTop: true,

    // movable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      partition: 'persist:sharedPartition',
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // const mainWindow = new BrowserWindow({
  //   width: 750,
  //   height: 460,
  //   // width: 100,
  //   // height: barHeight,
  //   // show: true,
  //   // x: 100,
  //   // y: screenHeight - barHeight,
  //   ...(process.platform === 'linux' ? { icon } : {}),

  //   autoHideMenuBar: true,
  //   // frame: false,
  //   frame: true,
  //   transparent: true,
  //   // alwaysOnTop: true,
  //   skipTaskbar: true,
  //   resizable: false,

  //   movable: true,
  //   focusable: false,
  //   ...(process.platform === 'linux' ? { icon } : {}),
  //   webPreferences: {
  //     partition: 'persist:sharedPartition',
  //     preload: join(__dirname, '../preload/index.js'),
  //     sandbox: false
  //   }
  // })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    console.log('relad..........', __dirname)
    mainWindow.webContents.openDevTools()
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
