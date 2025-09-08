import { set } from 'idb-keyval'
import { appEmitter } from '@penx/emitter'
import { sendMessage } from './message'

export function watchAuth() {
  window.addEventListener('message', async (event) => {
    if (
      event.data &&
      event.data.type === 'penx-logout' &&
      event.data.source === 'penx-account'
    ) {
      sendMessage('logout', {})
    }

    if (
      event.data &&
      event.data.type === 'penx-login' &&
      event.data.source === 'penx-account'
    ) {
      sendMessage('login', { session: event.data.payload })
    }
  })
}
