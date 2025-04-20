'use client'

import { atom, useAtom } from 'jotai'

const loginDialogAtom = atom<boolean>(false)

export function useLoginDialog() {
  const [isOpen, setIsOpen] = useAtom(loginDialogAtom)
  return { isOpen, setIsOpen }
}
