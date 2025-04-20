'use client'

import { atom, useAtom } from 'jotai'

const submitFriendLinkDialogAtom = atom<boolean>(false)

export function useSubmitFriendLinkDialog() {
  const [isOpen, setIsOpen] = useAtom(submitFriendLinkDialogAtom)
  return { isOpen, setIsOpen }
}
