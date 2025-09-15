import { onMessage, sendMessage } from '@/lib/message'
import { browser } from '#imports'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { ICreationNode } from '@penx/model-type'
import { BrowserTabProps } from '@penx/model-type/IStructProps'
import { store } from '@penx/store'

export function watchEvent() {
  appEmitter.on('OPEN_BROWSER_TAB', (tab: BrowserTabProps) => {
    browser.tabs.update(tab.id, { active: true })
  })

  appEmitter.on('UPDATE_USERSCRIPT_CODE', async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })

    setTimeout(() => {
      sendMessage('setupUserscript', { url: tab.url! })
    }, 1000)
  })

  onMessage('bookmarkUpdated', () => {
    appEmitter.emit('BOOKMARK_UPDATED')
    store.creations.refetchCreations()
  })

  appEmitter.on('DELETE_CREATION_SUCCESS', (data: ICreationNode) => {
    sendMessage('deleteCreation', { creation: data })
  })
}
