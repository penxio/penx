'use client'

import { atom, useAtom } from 'jotai'

const drawerAtom = atom<boolean>(false)

export function useMoreStructDrawer() {
  const [isOpen, setIsOpen] = useAtom(drawerAtom)
  return { isOpen, setIsOpen }
}
