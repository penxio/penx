import { get, set } from 'idb-keyval'
import { PENX_AUTHORIZED_USER, PENX_SESSION_DATA } from '@penx/constants'

export interface Session {
  userId: string
  address: string
  earlyAccessCode: string
  publicKey: string
  secret: string
  email: string
  user: {
    name: string
    email: string
    image: string
    id: string
  }
}

export async function getAuthorizedUser() {
  try {
    return await get(PENX_AUTHORIZED_USER)
  } catch (error) {
    console.log('error0', error)
    return undefined
  }
}

export async function clearAuthorizedUser() {
  await set(PENX_AUTHORIZED_USER, null)
}

export async function setAuthorizedUser(user: any) {
  await set(PENX_AUTHORIZED_USER, user)
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

export async function setLocalSession(session: any) {
  await set(PENX_SESSION_DATA, session)
}

export async function getActiveSpaceId(): Promise<string> {
  const session = await getLocalSession()
  if (!session) return ''
  return (await get(`ACTIVE_SPACE_${session.userId}`)) as string
}

export async function setActiveSpaceId(id: string) {
  const session = await getLocalSession()
  if (!session) return
  await set(`ACTIVE_SPACE_${session.userId}`, id)
}
