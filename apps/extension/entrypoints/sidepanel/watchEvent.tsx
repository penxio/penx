import { browser } from '#imports'
import { appEmitter } from '@penx/emitter'
import { BrowserTab } from '@penx/model-type/IStructProps'

export function watchEvent() {
  appEmitter.on('OPEN_BROWSER_TAB', (tab: BrowserTab) => {
    console.log('=====chrome:', chrome)

    browser.tabs.update(tab.id, { active: true })
  })
}
