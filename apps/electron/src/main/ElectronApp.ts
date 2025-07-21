import { join } from 'path'
import { electronApp, is, optimizer, platform } from '@electron-toolkit/utils'
import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  screen,
  shell,
  Tray,
} from 'electron'
import { Conf } from 'electron-conf/main'
import { SHORTCUT_LIST } from '@penx/constants'
import { Shortcut, ShortcutType } from '@penx/types'
import { convertKeysToHotkey } from '@penx/utils'
import icon from '../../resources/icon.png?asset'
import trayIcon from '../../resources/tray-16.png?asset'
import { AppUpdater } from './AppUpdater'
import { createInputWindow } from './createInputWindow'
// import { createMainWindow } from './createMainWindow'
import { createPanelWindow } from './createPanelWindow'
import {
  activateVisualFocus,
  FrontAppMeta,
  getCurrentFrontAppAndWindow,
  restoreInputFocus,
} from './NativeFocusManager'
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

  isOverlayVisible = false
  frontAppMeta: FrontAppMeta | null = null

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
      // this.windows.mainWindow = createMainWindow()
      this.windows.panelWindow = createPanelWindow()
      // this.windows.inputWindow = createInputWindow()

      setTimeout(() => {
        app.dock?.show()
      }, 100)

      if (process.platform === 'darwin') {
        console.log('set doc icon>>>>>>>>>>>>>>:', icon)
        const image = nativeImage.createFromPath(icon)
        app.dock?.setIcon(image)
      }

      app.setAccessibilitySupportEnabled(true)

      this.createTray()
      // registerShortcut({
      //   windows: this.windows,
      //   onCreateWindow: () => {
      //     this.windows.panelWindow = createPanelWindow()
      //   },
      // })
      await this.startServer()

      this.conf = new Conf()
      this.conf.registerRendererListener()

      this.registerShortcut()

      // this.mainWindow.on('close', (e) => {
      //   // e.preventDefault()
      //   // this.mainWindow.hide()
      //   this.windows.mainWindow = null as any
      // })

      this.panelWindow.on('close', (e) => {
        // e.preventDefault()
        // this.panelWindow.hide()
        this.windows.panelWindow = null as any
      })

      // this.inputWindow.on('closed', () => {
      //   this.windows.inputWindow = null as any
      // })

      this.panelWindow.on('blur', async () => {
        console.log('blur panel..........isDev:', is.dev)

        const pinned = await this.conf.get('pinned')
        if (!is.dev && !pinned) {
          this.panelWindow.hide()
        }
        // this.panelWindow.hide()
      })

      this.setupIPC()

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.

        if (!this.mainWindow) {
          this.toggleMainWindow()
        }

        // if (BrowserWindow.getAllWindows().length === 0) {
        //   this.windows.mainWindow = createMainWindow()
        // }
      })
    } catch (error) {
      console.error('Failed to initialize app:', error)
      dialog.showErrorBox('Start failed', `App start failed: ${error}`)
      app.quit()
    }

    app.on('will-quit', () => {
      globalShortcut.unregisterAll()
    })

    const appUpdater = new AppUpdater()

    setTimeout(() => {
      appUpdater.checkForUpdates()
    }, 3000)

    setInterval(
      () => {
        appUpdater.checkForUpdates()
      },
      2 * 60 * 60 * 1000,
    )
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

  private async toggleMainWindow() {
    // const mainWindow = this.windows.mainWindow!
    // const show = async () => {
    //   mainWindow.show()
    // }
    // try {
    //   if (!mainWindow) {
    //     this.windows.mainWindow = createMainWindow()
    //     show()
    //   } else if (mainWindow.isVisible()) {
    //     if (mainWindow.isFocused()) {
    //       mainWindow.hide()
    //     } else {
    //       // mainWindow.focus()
    //     }
    //   } else {
    //     show()
    //     mainWindow.setAlwaysOnTop(true)
    //     // mainWindow.focus()
    //     mainWindow.setAlwaysOnTop(false)
    //   }
    // } catch (error) {
    //   console.log('======error:', error)
    //   this.windows.mainWindow = createMainWindow()
    //   show()
    // }
  }

  private togglePanelWindow() {
    const panelWindow = this.windows.panelWindow!
    const setWindowPos = () => {
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
    }

    // const toggle = async () => {
    //   if (isVisibleAndFocused()) {
    //     const { frontAppMeta } = this
    //     this.panelWindow.hide()
    //     if (frontAppMeta) {
    //       await restoreInputFocus(frontAppMeta.appName, frontAppMeta.windowName)
    //     }
    //   } else {
    //     this.frontAppMeta = await getCurrentFrontAppAndWindow()
    //     const { frontAppMeta } = this
    //     if (!frontAppMeta) return
    //     this.panelWindow.showInactive()
    //     await activateVisualFocus(frontAppMeta.appName, frontAppMeta.windowName)
    //     this.panelWindow.webContents.send('focus-search-input')
    //   }
    // }

    const toggle = async () => {
      if (isVisibleAndFocused()) {
        hide()
      } else {
        setWindowPos()
        showAndFocus()
        panelWindow.webContents.send('panel-window-show')
      }
    }

    const isVisibleAndFocused = () => {
      return this.panelWindow.isVisible() && this.panelWindow.isFocused()
    }

    const hide = () => {
      if (platform.isMacOS) {
        app.hide()
      }

      // In order to restore focus correctly to the previously focused window, we need to minimize the window on
      // Windows.
      if (platform.isWindows) {
        this.panelWindow.minimize()
      }

      this.panelWindow.hide()
    }

    const showAndFocus = () => {
      if (typeof app.show === 'function') {
        app.show()
      }

      this.panelWindow.show()

      // Because the window is minimized on Windows when hidden, we need to restore it before focusing it.
      if (platform.isWindows) {
        this.panelWindow.restore()
      }

      this.panelWindow.focus()
    }

    toggle()

    {
      // const showOverlay = () => {
      //   this.panelWindow.showInactive()
      //   // this.panelWindow.focus()
      //   this.isOverlayVisible = true
      // }
      // const hideOverlay = () => {
      //   this.panelWindow.hide()
      //   app.hide()
      //   this.isOverlayVisible = false
      // }
      // if (this.isOverlayVisible) {
      //   hideOverlay()
      // } else {
      //   showOverlay()
      // }
    }

    return

    // try {
    //   if (!panelWindow) {
    //     this.windows.panelWindow = createPanelWindow()
    //     show()
    //   } else if (panelWindow.isVisible()) {
    //     if (panelWindow.isFocused()) {
    //       panelWindow.hide()
    //     } else {
    //       panelWindow.focus()
    //     }
    //   } else {
    //     show()
    //     panelWindow.setAlwaysOnTop(true)
    //     panelWindow.focus()
    //     panelWindow.setAlwaysOnTop(false)
    //   }
    // } catch (error) {
    //   console.log('======error:', error)
    //   this.windows.panelWindow = createPanelWindow()
    //   show()
    // }
  }

  private async toggleInputWindow() {
    const inputWindow = this.windows.inputWindow!
    const show = async () => {
      inputWindow.show()

      const pinned = await this.conf.get('pinned')
      inputWindow.setAlwaysOnTop(!!pinned)

      inputWindow.webContents.send('input-window-show')
    }
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

  private async registerShortcut() {
    // let shortcuts = (await this.conf.get(SHORTCUT_LIST)) as Shortcut[]
    let shortcuts: Shortcut[] = null as any

    if (!shortcuts) {
      shortcuts = [
        {
          key: platform.isMacOS
            ? ['Command', 'Shift', 'Space']
            : ['Ctrl', 'Shift', 'Space'],
          type: ShortcutType.TOGGLE_MAIN_WINDOW,
        },
        {
          key: ['Alt', 'S'],
          type: ShortcutType.TOGGLE_PANEL_WINDOW,
        },
        {
          key: ['Alt', 'I'],
          type: ShortcutType.TOGGLE_INPUT_WINDOW,
        },
      ]
      this.conf.set(SHORTCUT_LIST, shortcuts)
    }

    console.log('=======shortcuts:', shortcuts)

    for (const shortcut of shortcuts) {
      const acc = convertKeysToHotkey(shortcut.key)
      const ret = globalShortcut.register(acc, () => {
        // if (shortcut.type === ShortcutType.TOGGLE_MAIN_WINDOW) {
        //   this.toggleMainWindow()
        // }
        if (shortcut.type === ShortcutType.TOGGLE_PANEL_WINDOW) {
          this.togglePanelWindow()
        }
        // if (shortcut.type === ShortcutType.TOGGLE_INPUT_WINDOW) {
        //   this.toggleInputWindow()
        // }
      })
      if (!ret) {
        console.log('register shortcut fail:', shortcut.key)
      }
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

    ipcMain.on('hide-panel-window', () => {
      this.togglePanelWindow()
    })

    // ipcMain.on('hide-input-window', () => {
    //   this.inputWindow.hide()
    // })

    ipcMain.handle('register-shortcut', (event, shortcut: Shortcut) => {
      const key = convertKeysToHotkey(shortcut.key)
      const ret = globalShortcut.register(key, () => {
        event.sender.send('shortcut-pressed')

        // if (shortcut.type === ShortcutType.TOGGLE_MAIN_WINDOW) {
        //   this.toggleMainWindow()
        // }
        if (shortcut.type === ShortcutType.TOGGLE_PANEL_WINDOW) {
          this.togglePanelWindow()
        }
        // if (shortcut.type === ShortcutType.TOGGLE_INPUT_WINDOW) {
        //   this.toggleInputWindow()
        // }
      })

      if (!ret) {
        console.log('register shortcut fail')
      }
    })

    ipcMain.handle('unregister-shortcut', (_, shortcut: Shortcut) => {
      console.log(
        '=======unregister-shortcut:',
        convertKeysToHotkey(shortcut.key),
      )
      globalShortcut.unregister(convertKeysToHotkey(shortcut.key))
    })

    // ipcMain.on('toggle-main-window', () => {
    //   this.toggleMainWindow()
    // })

    ipcMain.on('toggle-panel-window', () => {
      this.togglePanelWindow()
    })

    // ipcMain.on('toggle-input-window', () => {
    //   this.toggleInputWindow()
    // })

    ipcMain.on('quick-input-success', () => {
      this.mainWindow.webContents.send('quick-input-success')
      this.panelWindow.webContents.send('quick-input-success')
    })

    ipcMain.on('pinned', (_, pinned) => {
      this.panelWindow.setAlwaysOnTop(pinned)
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

  private createTray() {
    const mainWindow = this.mainWindow!
    const panelWindow = this.panelWindow!
    const nativeTrayIcon = nativeImage.createFromPath(trayIcon)

    const tray = new Tray(nativeTrayIcon)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open PenX Editor',
        type: 'normal',
        click: () => {
          this.toggleMainWindow()
        },
      },
      {
        label: 'Open Search Panel',
        type: 'normal',
        click: () => {
          this.togglePanelWindow()
        },
      },
      {
        label: 'Open Quick Input',
        type: 'normal',
        click: () => {
          this.toggleInputWindow()
        },
      },
      {
        label: 'Edit Shortcuts',
        type: 'normal',
        click: () => {
          mainWindow.show()
          mainWindow.webContents.send('edit-shortcuts')
        },
      },
      {
        label: 'Quit',
        click: () => {
          if (mainWindow) {
            mainWindow.removeAllListeners('close')
            mainWindow.close()
          }
          if (panelWindow) {
            panelWindow.removeAllListeners('close')
            panelWindow.close()
          }
          app.quit()
        },
      },
    ])
    tray.setToolTip('PenX')
    tray.setContextMenu(contextMenu)
  }
}
