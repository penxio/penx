'use client'

import { atom, useAtom } from 'jotai'

const deployNewSiteDialogAtom = atom<boolean>(false)

export function useDeployNewSiteDialog() {
  const [isOpen, setIsOpen] = useAtom(deployNewSiteDialogAtom)
  return { isOpen, setIsOpen }
}
