'use client'

import { atom, useAtom } from 'jotai'

export const postLoadingAtom = atom<boolean>(false)

export function usePostLoading() {
  const [isPostLoading, setPostLoading] = useAtom(postLoadingAtom)
  return { isPostLoading, setPostLoading }
}
