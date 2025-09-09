import { onMessage, sendMessage } from '@/lib/message'
import { storage } from '@/lib/storage'

export async function setupMessage() {
  console.log('====setupMessage....')

  onMessage('chromeAIPrompt', async () => {
    //
  })

  onMessage('logout', () => {
    console.log('extension logou....')
    storage.setSession(null)
  })

  onMessage('login', ({ data }) => {
    console.log('extension login....', data.session)
    storage.setSession(data.session)
  })
}
