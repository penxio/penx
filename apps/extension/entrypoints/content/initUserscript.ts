import { sendMessage } from '@/lib/message'
import { appEmitter } from '@penx/emitter'

export function initUserscript() {
  console.log('======>>>>initUserscrit')

  sendMessage('setupUserscript', { url: window.location.href })
}
