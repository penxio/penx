import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createMainWindow } from './createMainWindow'
import { createTray } from './createTray'
import { createPanelWindow } from './createPanelWindow'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let mainWindow: BrowserWindow
let panelWindow: BrowserWindow

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  mainWindow = createMainWindow()
  panelWindow = createPanelWindow()

  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    }
  })

  {
    function toggleSecondWindow() {
      if (!panelWindow) {
        panelWindow = createPanelWindow()
        panelWindow.show()
      } else if (panelWindow.isVisible()) {
        if (panelWindow.isFocused()) {
          panelWindow.hide()
        } else {
          panelWindow.focus()
        }
      } else {
        panelWindow.show()
        panelWindow.setAlwaysOnTop(true)
        panelWindow.focus()
        panelWindow.setAlwaysOnTop(false)
      }
    }

    const ret = globalShortcut.register('CmdOrCtrl+D', () => {
      console.log('全局快捷键 CmdOrCtrl+X 被触发')
      toggleSecondWindow()
    })

    if (!ret) {
      console.log('快捷键注册失败，可能被其他程序占用')
    }

    console.log('isRegistered====', globalShortcut.isRegistered('CmdOrCtrl+D'))

    app.on('will-quit', () => {
      globalShortcut.unregister('CmdOrCtrl+D')
      globalShortcut.unregisterAll()
    })
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
