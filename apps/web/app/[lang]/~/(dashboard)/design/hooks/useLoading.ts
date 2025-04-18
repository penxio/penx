'use client'

import { atom, useAtom } from 'jotai'

const loadingAtom = atom<boolean>(false)

export function useLoading() {
  const [loading, setLoading] = useAtom(loadingAtom)
  return {
    isLoading: loading,
    setLoading,
  }
}
