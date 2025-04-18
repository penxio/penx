import { get, set } from 'idb-keyval'

export const PENX_SESSION_DATA = 'PENX_SESSION_DATA'

export interface Session {
  userId: string
  address: string
  email: string
  role: string
  user: {
    name: string
    email: string
    image: string
    id: string
  }
}

export async function getLocalSession(): Promise<Session | undefined> {
  try {
    return await get(PENX_SESSION_DATA)
  } catch (error) {
    console.log('error1', error)

    return undefined
  }
}

export async function clearLocalSession() {
  await set(PENX_SESSION_DATA, null)
}

export async function setLocalSession(session: Session) {
  await set(PENX_SESSION_DATA, session)
}
