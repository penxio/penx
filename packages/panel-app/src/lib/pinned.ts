import { Conf } from 'electron-conf/renderer'
import { queryClient } from '@penx/query-client'

const conf = new Conf()

export async function pinWindow() {
  await conf.set('pinned', true)
  window.electron.ipcRenderer.send('pinned', true)
  queryClient.setQueryData(['input-window-pinned'], true)
}

export async function unpinWindow() {
  await conf.set('pinned', false)
  window.electron.ipcRenderer.send('pinned', false)
  queryClient.setQueryData(['input-window-pinned'], false)
}
