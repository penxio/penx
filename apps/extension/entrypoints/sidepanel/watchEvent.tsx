import { sendMessage } from '@/lib/message'
import { browser } from '#imports'
import { appEmitter } from '@penx/emitter'
import { BrowserTab } from '@penx/model-type/IStructProps'

export function watchEvent() {
  appEmitter.on('OPEN_BROWSER_TAB', (tab: BrowserTab) => {
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
}
