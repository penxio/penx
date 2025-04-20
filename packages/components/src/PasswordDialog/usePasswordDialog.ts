'use client'

import { atom, useAtom } from 'jotai'

const passwordDialogAtom = atom<boolean>(false)

export function usePasswordDialog() {
  const [isOpen, setIsOpen] = useAtom(passwordDialogAtom)
  return { isOpen, setIsOpen }
}
