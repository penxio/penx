'use client'

import { atom, useAtom } from 'jotai'

type State = {
  type: 'login' | 'register' | 'register-email-sent' | 'sms-code-sent'
  data?: Record<string, any>
}
const authStatusAtom = atom<State>({
  type: 'login',
  data: {},
} as State)

export function useAuthStatus() {
  const [authStatus, setAuthStatus] = useAtom(authStatusAtom)
  return { authStatus, setAuthStatus }
}
