import { onMessage, sendMessage } from '@/lib/message'
import { storage } from '@/lib/storage'
import { browser } from '#imports'
import { Creation, Struct } from '@penx/domain'
import { localDB } from '@penx/local-db'
import { BookmarkProps, BrowserTabProps, IStructNode } from '@penx/model-type'

export async function setupMessage() {
  console.log('====setupMessage....')

  onMessage('chromeAIPrompt', async () => {
    //
  })

  onMessage('logout', () => {
    console.log('extension logout....')
    storage.setSession(null as any)
  })

  onMessage('login', ({ data }) => {
    console.log('extension login....', data.session)
    storage.setSession(data.session)
  })

  onMessage('deleteCreation', async ({ data }) => {
    console.log('======data:', data)

    try {
      const creation = new Creation(data.creation)
      const structNode = (await localDB.getNode(
        creation.structId,
      )) as IStructNode
      const struct = new Struct(structNode)
      const cells = creation.getCells<BookmarkProps | BrowserTabProps>(struct)
      console.log('=======cells:', cells)

      console.log('>>>>>>>>>>>>>deleteCreation', data)
      if (struct.isBookmark) {
        await browser.bookmarks.remove(cells.id.toString())
      }

      if (struct.isBrowserTab) {
        await browser.tabs.remove(cells.id)
      }
    } catch (error) {
      console.log('======error:', error)
    }
  })
}
