import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  screen,
  shell,
} from 'electron'
import { Conf } from 'electron-conf/main'
import { createInputWindow } from './createInputWindow'
import { createMainWindow } from './createMainWindow'
import { createPanelWindow } from './createPanelWindow'
import { createTray } from './createTray'
import { isPortInUse, killPort } from './port-killer'
import { HonoServer, ServerConfig } from './server'
import { Windows } from './types'

const port = 14158

export class ElectronApp {
  private windows = {} as Windows

  private honoServer: HonoServer | null = null
  private readonly isDev = !app.isPackaged

  private conf: Conf

  private get mainWindow() {
    return this.windows.mainWindow!
  }

  private get panelWindow() {
    return this.windows.panelWindow!
  }

  private get inputWindow() {
    return this.windows.inputWindow!
  }

  constructor() {
    this.setupApp()
  }

  private setupApp() {
    electronApp.setAppUserModelId('io.penx')
    app.commandLine.appendSwitch('--disable-web-security')
    app.commandLine.appendSwitch('--allow-running-insecure-content')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.whenReady().then(() => this.initialize())

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('before-quit', async () => {
      if (this.honoServer) {
        await this.honoServer.stop()
      }
    })
  }

  private async initialize() {
    try {
      this.windows.mainWindow = createMainWindow()
      this.windows.panelWindow = createPanelWindow()
      this.windows.inputWindow = createInputWindow()

      createTray(this.windows)
      this.registerPanelShortcut()
      this.registerInputShortcut()
      // registerShortcut({
      //   windows: this.windows,
      //   onCreateWindow: () => {
      //     this.windows.panelWindow = createPanelWindow()
      //   },
      // })
      await this.startServer()

      this.conf = new Conf()
      this.conf.registerRendererListener()

      this.mainWindow.on('close', (e) => {
        e.preventDefault()
        this.mainWindow.hide()
      })

      this.panelWindow.on('close', (e) => {
        e.preventDefault()
        this.panelWindow.hide()
      })

      this.panelWindow.on('closed', () => {
        this.windows.panelWindow = null as any
      })

      this.panelWindow.on('blur', () => {
        if (!is.dev) {
          this.panelWindow.hide()
        }
      })

      this.setupIPC()

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.windows.mainWindow = createMainWindow()
        }
      })
    } catch (error) {
      console.error('Failed to initialize app:', error)
      dialog.showErrorBox('Start failed', `App start failed: ${error}`)
      app.quit()
    }

    app.on('will-quit', () => {
      globalShortcut.unregister('CmdOrCtrl+D')
      globalShortcut.unregister('CmdOrCtrl+I')
      globalShortcut.unregisterAll()
    })
  }

  private async startServer() {
    const config: ServerConfig = {
      port: port,
      host: 'localhost',
      isDev: this.isDev,
      dataDir: join(app.getPath('userData'), 'data'),
    }

    this.honoServer = new HonoServer(config, this.windows)

    if (await isPortInUse(config.port)) {
      await killPort(config.port)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await this.honoServer.start()
    } else {
      await this.honoServer.start()
    }
  }

  private registerPanelShortcut() {
    const panelWindow = this.windows.panelWindow!
    function show() {
      const cursorPoint = screen.getCursorScreenPoint()
      const display = screen.getDisplayNearestPoint(cursorPoint)
      const { x, y, width, height } = display.workArea

      const winBounds = panelWindow.getBounds()
      const posX = x + Math.round((width - winBounds.width) / 2)
      const posY = y + Math.round((height - winBounds.height) / 2)

      panelWindow.setBounds({
        x: posX,
        y: posY,
        width: winBounds.width,
        height: winBounds.height,
      })

      panelWindow.show()
      panelWindow.webContents.send('main-window-show')
    }

    const togglePanelWindow = () => {
      try {
        if (!panelWindow) {
          this.windows.panelWindow = createPanelWindow()
          show()
        } else if (panelWindow.isVisible()) {
          if (panelWindow.isFocused()) {
            panelWindow.hide()
          } else {
            panelWindow.focus()
          }
        } else {
          show()
          panelWindow.setAlwaysOnTop(true)
          panelWindow.focus()
          panelWindow.setAlwaysOnTop(false)
        }
      } catch (error) {
        console.log('======error:', error)
        this.windows.panelWindow = createPanelWindow()
        show()
      }
    }

    const ret = globalShortcut.register('CmdOrCtrl+D', () => {
      togglePanelWindow()
    })

    if (!ret) {
      console.log('register shortcut fail')
    }

    console.log('isRegistered====', globalShortcut.isRegistered('CmdOrCtrl+D'))
  }

  private registerInputShortcut() {
    const inputWindow = this.windows.inputWindow!
    const show = async () => {
      const cursorPoint = screen.getCursorScreenPoint()
      const display = screen.getDisplayNearestPoint(cursorPoint)
      // const { x, y, width, height } = display.workArea

      // const winBounds = inputWindow.getBounds()
      // const posX = x + Math.round((width - winBounds.width) / 2)
      // const posY = y + Math.round((height - winBounds.height) / 2)

      // inputWindow.setBounds({
      //   x: posX,
      //   y: posY,
      //   width: winBounds.width,
      //   height: winBounds.height,
      // })

      inputWindow.show()

      const pinned = await this.conf.get('pinned')
      inputWindow.setAlwaysOnTop(!!pinned)
    }

    const toggleInputWindow = async () => {
      try {
        if (!inputWindow) {
          this.windows.inputWindow = createInputWindow()
          show()
        } else if (inputWindow.isVisible()) {
          if (inputWindow.isFocused()) {
            inputWindow.hide()
          } else {
            inputWindow.focus()
          }
        } else {
          show()

          inputWindow.setAlwaysOnTop(true)
          inputWindow.focus()

          const pinned = await this.conf.get('pinned')
          inputWindow.setAlwaysOnTop(!!pinned)
        }
      } catch (error) {
        console.log('======error:', error)
        this.windows.inputWindow = createInputWindow()
        show()
      }
    }

    const ret = globalShortcut.register('CmdOrCtrl+I', () => {
      toggleInputWindow()
    })

    if (!ret) {
      console.log('register shortcut fail')
    }
  }

  private setupIPC() {
    ipcMain.handle('get-server-info', () => {
      return {
        port: port,
        host: 'localhost',
        baseUrl: `http://localhost:${port}`,
      }
    })

    ipcMain.handle('check-server-status', async () => {
      try {
        const response = await fetch(`http://localhost:${port}/health`)
        return response.ok
      } catch {
        return false
      }
    })

    ipcMain.handle('restart-app', () => {
      app.relaunch()
      app.exit()
    })

    ipcMain.on('close', () => {
      this.panelWindow.close()
    })

    ipcMain.on('close-input-window', () => {
      this.inputWindow.hide()
    })

    ipcMain.on('quick-input-success', () => {
      this.mainWindow.webContents.send('quick-input-success')
      this.panelWindow.webContents.send('quick-input-success')
    })

    ipcMain.on('pinned', (_, pinned) => {
      this.inputWindow.setAlwaysOnTop(pinned)
    })

    ipcMain.on('open-url', async (_, url: string) => {
      try {
        await shell.openExternal(url)
        return { success: true }
      } catch (error: any) {
        console.error('Failed to open URL:', error)
        return { success: false, error: error.message }
      }
    })
  }
}
