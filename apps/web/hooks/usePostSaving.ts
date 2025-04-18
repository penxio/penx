'use client'

import { atom, useAtom } from 'jotai'

export const postSavingAtom = atom<boolean>(false)

export function usePostSaving() {
  const [isPostSaving, setPostSaving] = useAtom(postSavingAtom)
  return { isPostSaving, setPostSaving }
}
