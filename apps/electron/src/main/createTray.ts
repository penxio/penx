import { app, ipcMain, Menu, nativeImage, Tray } from 'electron'
import icon from '../../resources/tray-16.png?asset'
import { Windows } from './types'

export function createTray(windows: Windows) {
  const mainWindow = windows.mainWindow!
  const panelWindow = windows.panelWindow!
  const trayIcon = nativeImage.createFromPath(icon)

  const tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open PenX Editor',
      type: 'normal',
      click: () => {
        mainWindow.show()
      },
    },
    {
      label: 'Open PenX Panel',
      type: 'normal',
      click: () => {
        panelWindow.show()
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
