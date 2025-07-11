import { app, Menu, nativeImage, Tray } from 'electron'
import icon from '../../resources/tray-16.png?asset'
import { Windows } from './types'

export function createTray(windows: Windows) {
  const mainWindow = windows.mainWindow!
  console.log('=======icon:', icon)
  const trayIcon = nativeImage.createFromPath(icon)

  const tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open PenX',
      type: 'normal',
      click: () => {
        mainWindow.show()
      },
    },
    { label: 'Item1', type: 'normal' },
    { label: 'Item1', type: 'normal' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.removeAllListeners('close')
        mainWindow.close()
        app.quit()
      },
    },
  ])
  tray.setToolTip('PenX')
  tray.setContextMenu(contextMenu)
}
