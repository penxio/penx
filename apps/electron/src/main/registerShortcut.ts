import { app, globalShortcut } from 'electron'
export function registerShortcut() {
  const ret = globalShortcut.register('CmdOrCtrl+D', () => {
    console.log('全局快捷键 CmdOrCtrl+X 被触发')
  })

  if (!ret) {
    console.log('快捷键注册失败，可能被其他程序占用')
  }

  console.log(globalShortcut.isRegistered('CmdOrCtrl+D'))

  app.on('will-quit', () => {
    globalShortcut.unregister('CmdOrCtrl+D')
    globalShortcut.unregisterAll()
  })
}
