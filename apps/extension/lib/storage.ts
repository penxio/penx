import { storage as s } from '#imports'
import { SessionData } from '@penx/types'

export const storage = {
  keys: {
    session: 'local:session',
  } as const,
  async getSession() {
    return (await s.getItem<SessionData>(storage.keys.session))!
  },

  async setSession(value: SessionData) {
    await s.setItem(storage.keys.session, value)
  },
}
