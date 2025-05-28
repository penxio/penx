'use client'

import { atom, useAtom } from 'jotai'

const upgradeDrawerAtom = atom<boolean>(false)

export function useUpgradeDrawer() {
  const [isOpen, setIsOpen] = useAtom(upgradeDrawerAtom)
  return { isOpen, setIsOpen }
}
