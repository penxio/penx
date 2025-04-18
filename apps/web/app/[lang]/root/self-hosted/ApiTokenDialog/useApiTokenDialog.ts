'use client'

import { atom, useAtom } from 'jotai'

const apiTokenDialogAtom = atom<boolean>(false)

export function useApiTokenDialog() {
  const [isOpen, setIsOpen] = useAtom(apiTokenDialogAtom)
  return { isOpen, setIsOpen }
}
