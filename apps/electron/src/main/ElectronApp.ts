import { join, resolve } from 'path'
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
import { checkAccessibilityPermissions, getSelection } from 'node-selection'
import { windowManager } from 'node-window-manager'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { CHROME_INFO, SHORTCUT_LIST } from '@penx/constants'
import { db } from '@penx/db/client'
import { embeddings } from '@penx/db/schema'
import { Shortcut, ShortcutType } from '@penx/model-type'
import { SessionData } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { convertKeysToHotkey } from '@penx/utils'
import icon from '../../resources/icon.png?asset'
import trayIcon from '../../resources/tray-16.png?asset'
import { AppUpdater } from './AppUpdater'
import { createAICommandWindow } from './createAICommandWindow'
// import { createMainWindow } from './createMainWindow'
import { createPanelWindow } from './createPanelWindow'
import { createEmbeddings } from './lib/embeddings/createEmbeddings'
import { deleteDatabase } from './lib/deleteDatabase'
import { deleteEmbeddingTable } from './lib/deleteEmbeddingTable'
import { initEmbeddings } from './lib/embeddings/initEmbeddings'
import { initPGLite } from './lib/initPGLite'
import { loadModel } from './lib/embeddings/loadModel'
import { retrieve } from './lib/retrieve'
import { buildMDocument } from './lib/embeddings/userCreationChunk'
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

interface ToggleWindowOptions {
  openOnly?: boolean
  bounds?: Electron.Rectangle
}

export class ElectronApp {
  private windows = {} as Windows

  private honoServer: HonoServer | null = null
  private readonly isDev = !app.isPackaged

  private conf: Conf

  private lastBounds: Electron.Rectangle | null = null
  private lastOffset: { offsetX: number; offsetY: number } | null = null
  private tray: Tray | null = null

  private get mainWindow() {
    return this.windows.mainWindow!
  }

  private get panelWindow() {
    return this.windows.panelWindow!
  }

  private get aiCommandWindow() {
    return this.windows.aiCommandWindow!
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

  private async initSelection() {
    if (!(await checkAccessibilityPermissions({ prompt: true }))) {
      console.log('grant accessibility permissions and restart this program')
    }
  }

  private async initialize() {
    try {
      // this.windows.mainWindow = createMainWindow()
      this.windows.panelWindow = createPanelWindow()
      this.windows.aiCommandWindow = createAICommandWindow()

      // setTimeout(() => {
      //   app.dock?.show()
      // }, 100)

      // if (process.platform === 'darwin') {
      //   const image = nativeImage.createFromPath(icon)
      //   app.dock?.setIcon(image)
      // }

      app.setAccessibilitySupportEnabled(true)

      this.conf = new Conf()

      this.conf.set(CHROME_INFO, null)

      // registerShortcut({
      //   windows: this.windows,
      //   onCreateWindow: () => {
      //     this.windows.panelWindow = createPanelWindow()
      //   },
      // })
      await this.startServer()
      await this.initPGLite()

      this.conf.registerRendererListener()

      this.createTray()
      this.registerShortcut()

      this.initSelection()

      this.runIOHook()

      initEmbeddings()

      const schemeName = 'penx'
      if (is.dev) {
        app.setAsDefaultProtocolClient(schemeName, process.execPath, [
          resolve(process.argv[1]),
        ])
      } else {
        app.setAsDefaultProtocolClient(schemeName)
      }

      app.on('open-url', (event, url) => {
        event.preventDefault()
        console.log('scheme url...........', url)
        this.panelWindow.show()
        this.panelWindow.focus()
      })

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

      this.panelWindow.on('blur', async () => {
        console.log('blur panel..........isDev:', is.dev)

        // Add a small delay to prevent immediate hiding when switching between windows
        setTimeout(async () => {
          const pinned = await this.conf.get('pinned')
          // Only hide if the window is still not focused and not pinned
          if (!is.dev && !pinned && !this.panelWindow.isFocused()) {
            this.panelWindow.hide()
          }
        }, 100)

        // if (!pinned) {
        //   this.panelWindow.hide()
        // }
      })

      this.setupIPC()

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        // For PenX, we want to show the panel window when activated

        if (!this.panelWindow || this.panelWindow.isDestroyed()) {
          this.windows.panelWindow = createPanelWindow()
        }

        // Show and focus the panel window when app is activated
        this.togglePanelWindow({ openOnly: true })
      })
    } catch (error) {
      console.error('Failed to initialize app:', error)
      dialog.showErrorBox('Start failed', `App start failed: ${error}`)
      app.quit()
    }

    app.on('will-quit', () => {
      globalShortcut.unregisterAll()
    })

    const appUpdater = new AppUpdater(this.windows)

    setTimeout(() => {
      appUpdater.checkForUpdates()
    }, 3000)

    setInterval(
      () => {
        appUpdater.checkForUpdates()
      },
      10 * 60 * 1000,
    )
  }

  private async initPGLite() {
    // await deleteEmbeddingTable()
    await initPGLite()
    // await deleteDatabase()
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

  private togglePanelWindow(opt?: ToggleWindowOptions) {
    const { openOnly = false, bounds } = opt || {}
    console.log(openOnly ? 'open....' : 'toggle......')

    const panelWindow = this.windows.panelWindow!
    const setWindowPos = () => {
      const cursorPoint = screen.getCursorScreenPoint()
      const display = screen.getDisplayNearestPoint(cursorPoint)
      const { x, y, width, height } = display.workArea

      const winBounds = panelWindow.getBounds()
      const posX = x + Math.round((width - winBounds.width) / 2)
      const posY = y + Math.round((height - winBounds.height) / 2)

      if (bounds) {
        panelWindow.setBounds(bounds)
        return
      }

      if (this.lastBounds && this.lastOffset) {
        panelWindow.setBounds({
          x: x + this.lastOffset.offsetX,
          y: y + this.lastOffset.offsetY,
          width: winBounds.width,
          height: winBounds.height,
        })
      } else {
        panelWindow.setBounds({
          x: posX,
          y: posY,
          width: winBounds.width,
          height: winBounds.height,
        })
      }
    }

    const toggle = async () => {
      if (!this.panelWindow) {
        this.windows.panelWindow = createPanelWindow()
        setWindowPos()
        showAndFocus()
        panelWindow.webContents.send('panel-window-show')
        return
      }

      if (isVisibleAndFocused() && !openOnly) {
        this.lastBounds = panelWindow.getBounds()
        this.saveLastOffset()
        hide()
      } else {
        setWindowPos()
        showAndFocus()
        panelWindow.webContents.send('panel-window-show')

        const appUpdater = new AppUpdater(this.windows)
        appUpdater.checkForUpdates()
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

    return
  }
  private saveLastOffset() {
    const cursorPoint = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(cursorPoint)
    const { x, y } = display.workArea
    const winBounds = this.panelWindow.getBounds()
    this.lastOffset = { offsetX: winBounds.x - x, offsetY: winBounds.y - y }
  }

  private hideAICommandWindow() {
    if (platform.isMacOS) {
      app.hide()
    }

    // In order to restore focus correctly to the previously focused window, we need to minimize the window on
    // Windows.
    if (platform.isWindows) {
      this.aiCommandWindow.minimize()
    }

    this.aiCommandWindow.hide()
  }

  private toggleAICommandWindow(openOnly = false) {
    console.log(openOnly ? 'open....' : 'toggle......')
    const win = this.windows.aiCommandWindow!
    const setWindowPos = () => {
      const cursorPoint = screen.getCursorScreenPoint()
      const display = screen.getDisplayNearestPoint(cursorPoint)
      const { x, y, width, height } = display.workArea

      const panelWidth = 280
      const padding = 60

      const bounds = {
        x: x + (width - panelWidth),
        y: y + padding,
        width: panelWidth,
        height: height - padding * 2,
      }

      win.setBounds(bounds)
    }

    const toggle = async () => {
      if (!this.aiCommandWindow) {
        this.windows.aiCommandWindow = createAICommandWindow()
        setWindowPos()
        showAndFocus()
        win.webContents.send('ai-command-window-show')
        return
      }

      if (isVisibleAndFocused() && !openOnly) {
        this.lastBounds = win.getBounds()
        this.saveLastOffset()
        this.hideAICommandWindow()
      } else {
        setWindowPos()
        showAndFocus()

        win.webContents.send('ai-command-window-show')
      }
    }

    const isVisibleAndFocused = () => {
      return (
        this.aiCommandWindow.isVisible() && this.aiCommandWindow.isFocused()
      )
    }

    const showAndFocus = () => {
      if (typeof app.show === 'function') {
        app.show()
      }

      this.aiCommandWindow.show()

      // Because the window is minimized on Windows when hidden, we need to restore it before focusing it.
      if (platform.isWindows) {
        this.aiCommandWindow.restore()
      }

      this.aiCommandWindow.focus()
    }

    toggle()
  }

  private async registerShortcut() {
    let shortcuts = (await this.conf.get(SHORTCUT_LIST)) as Shortcut[]

    if (!shortcuts) {
      shortcuts = [
        {
          keys: platform.isMacOS
            ? ['Command', 'Shift', 'Space']
            : ['Ctrl', 'Shift', 'Space'],
          type: ShortcutType.TOGGLE_MAIN_WINDOW,
        },
        {
          keys: ['Alt', 'S'],
          type: ShortcutType.TOGGLE_PANEL_WINDOW,
        },
      ]
      this.conf.set(SHORTCUT_LIST, shortcuts)
    }

    // console.log('=======shortcuts:', shortcuts)

    for (const shortcut of shortcuts) {
      const acc = convertKeysToHotkey(shortcut.keys)
      const ret = globalShortcut.register(acc, () => {
        // if (shortcut.type === ShortcutType.TOGGLE_MAIN_WINDOW) {
        //   this.toggleMainWindow()
        // }
        if (shortcut.type === ShortcutType.TOGGLE_PANEL_WINDOW) {
          this.togglePanelWindow()
        }
      })
      if (!ret) {
        console.log('register shortcut fail:', shortcut.keys)
      }
    }

    {
      globalShortcut.register('Alt+T', async () => {
        const selection = await getSelection()
        console.log('=====selection:', selection)
        this.panelWindow.webContents.send('translate', selection.text)
      })
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

    ipcMain.handle('register-shortcut', (event, shortcut: Shortcut) => {
      const key = convertKeysToHotkey(shortcut.keys)
      const ret = globalShortcut.register(key, () => {
        event.sender.send('shortcut-pressed', shortcut)

        // if (shortcut.type === ShortcutType.TOGGLE_MAIN_WINDOW) {
        //   this.toggleMainWindow()
        // }

        if (shortcut.type === ShortcutType.TOGGLE_PANEL_WINDOW) {
          this.togglePanelWindow()
          this.updateTrayMenu()
        }
      })

      if (!ret) {
        console.log('register shortcut fail')
      }
    })

    ipcMain.handle('unregister-shortcut', (_, shortcut: Shortcut) => {
      console.log('=====unregister=shortcut:', shortcut)

      console.log(
        '=======unregister-shortcut:',
        convertKeysToHotkey(shortcut.keys),
      )
      globalShortcut.unregister(convertKeysToHotkey(shortcut.keys))
    })

    // ipcMain.on('toggle-main-window', () => {
    //   this.toggleMainWindow()
    // })

    ipcMain.on('hide-panel-window', () => {
      this.togglePanelWindow()
    })

    ipcMain.on('hide-ai-command-window', () => {
      this.hideAICommandWindow()
    })

    ipcMain.on('toggle-panel-window', () => {
      this.togglePanelWindow()
    })

    ipcMain.on('open-panel-window', () => {
      this.togglePanelWindow({ openOnly: true })
    })

    ipcMain.on('toggle-ai-command-window', () => {
      this.toggleAICommandWindow()
    })

    ipcMain.on('quick-input-success', () => {
      this.mainWindow.webContents.send('quick-input-success')
      this.panelWindow.webContents.send('quick-input-success')
    })

    ipcMain.on('pinned', (_, pinned) => {
      this.panelWindow.setAlwaysOnTop(pinned)
    })

    ipcMain.on('translate-text', (_, text: string) => {
      console.log('>>>>>>>>>translate-text:', text)
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

    ipcMain.on(
      'open-ai-command',
      async (_, data: { creationId: string; selection: Selection }) => {
        console.log('>>>>>>>>open-ai-command', data)
        this.panelWindow.webContents.send('open-ai-command', data)
        this.hideAICommandWindow()
      },
    )
  }

  private openQuickInputCommand() {
    // this.panelWindow.close()
    // this.windows.panelWindow = createPanelWindow()
    // this.togglePanelWindow()
    this.panelWindow.webContents.send('open-quick-input')
  }

  private runIOHook() {
    let lastAltDownTime = 0
    let lastCmdDownTime = 0
    const doubleClickThreshold = 300

    uIOhook.on('keydown', async (event) => {
      // console.log('======event.keycode:', event.keycode)

      if (event.keycode === UiohookKey.Alt) {
        let now = Date.now()
        if (now - lastAltDownTime < doubleClickThreshold) {
          console.log('Cmd key double clicked')
          this.openQuickInputCommand()
        }
        lastAltDownTime = now
      }

      if (event.keycode === UiohookKey.Alt) {
        const selection = await getSelection()
        console.log('alt..... selection:', selection)
        if (selection?.text) {
          this.toggleAICommandWindow()
          setTimeout(() => {
            this.aiCommandWindow.webContents.send(
              'on-text-selection',
              selection,
            )
          }, 10)
        }
      }

      // if (event.keycode === UiohookKey.Meta) {
      //   console.log('Cmd key clicked')

      //   let now = Date.now()
      //   if (now - lastAltDownTime < doubleClickThreshold) {
      //     const window = windowManager.getActiveWindow()

      //     if (!window.path.includes('Chrome')) return
      //     console.log('get======window:', window)

      //     // Prints the currently focused window bounds.
      //     console.log(window.getBounds())

      //     // This method has to be called on macOS before changing the window's bounds, otherwise it will throw an error.
      //     // It will prompt an accessibility permission request dialog, if needed.
      //     windowManager.requestAccessibility()

      //     // Sets the active window's bounds.

      //     const cursorPoint = screen.getCursorScreenPoint()
      //     const display = screen.getDisplayNearestPoint(cursorPoint)
      //     const { x, y, width, height } = display.workArea
      //     const panelWidth = 380
      //     const gap = 4

      //     const openPanelWindow = () => {
      //       this.togglePanelWindow({
      //         openOnly: true,
      //         bounds: {
      //           x: x + (width - panelWidth + gap),
      //           y: y,
      //           width: panelWidth - gap,
      //           height: height,
      //         },
      //       })

      //       this.panelWindow.webContents.send('open-chat-to-browser')
      //     }

      //     if (window.getBounds().width === width - panelWidth) {
      //       console.log('isEqual.....')
      //       openPanelWindow()
      //       return
      //     }

      //     // window.setBounds({
      //     //   x: 0,
      //     //   y: 0,
      //     //   width: width - panelWidth,
      //     //   // height: height,
      //     //   height: display.bounds.height,
      //     // })

      //     window.bringToTop()
      //     openPanelWindow()
      //   }
      //   lastAltDownTime = now
      // }
    })

    // uIOhook.on('keyup', async (event) => {
    //   if (event.keycode === UiohookKey.Alt) {
    //     setTimeout(() => {
    //       this.hideAICommandWindow()
    //     }, 100)
    //   }
    // })

    uIOhook.start()
  }

  private async createTray() {
    const nativeTrayIcon = nativeImage.createFromPath(trayIcon)
    this.tray = new Tray(nativeTrayIcon)
    this.tray.setToolTip('PenX')
    await this.updateTrayMenu()
  }

  private async updateTrayMenu() {
    if (!this.tray) return

    const mainWindow = this.mainWindow!
    const panelWindow = this.panelWindow!
    let shortcuts = (await this.conf.get(SHORTCUT_LIST)) as Shortcut[]

    const shortcut = shortcuts.find(
      (s) => s.type === ShortcutType.TOGGLE_PANEL_WINDOW,
    )

    console.log('======tray=shortcut:', shortcut)

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open PenX',
        type: 'normal',
        // accelerator: '⌥+s',
        accelerator: shortcut ? shortcut.keys.join('+') : 'Alt+S',
        click: () => {
          this.togglePanelWindow()
        },
      },
      {
        label: 'Edit Shortcuts',
        type: 'normal',
        click: () => {
          panelWindow.show()
          panelWindow.webContents.send('edit-shortcuts')
        },
      },
      {
        label: 'Open DevTools',
        type: 'normal',
        click: () => {
          panelWindow.show()
          this.panelWindow.webContents.openDevTools()
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
    this.tray.setContextMenu(contextMenu)
  }
}
