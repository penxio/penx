import { app, Menu, Tray, nativeImage } from 'electron'
import { join } from 'path'
import icon from '../../resources/tray.png?asset'

export function createTray() {
  console.log('=======icon:', icon)
  const trayIcon = nativeImage.createFromPath(icon)

  const tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
}
