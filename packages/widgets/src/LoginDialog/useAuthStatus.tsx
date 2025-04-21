'use client'

import { atom, useAtom } from 'jotai'

const authStatusAtom = atom<'login' | 'register' | 'register-email-sent'>(
  'login',
)

export function useAuthStatus() {
  const [authStatus, setAuthStatus] = useAtom(authStatusAtom)
  return { authStatus, setAuthStatus }
}
