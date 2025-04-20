'use client'

import { atom, useAtom } from 'jotai'

const planListDialogAtom = atom<boolean>(false)

export function usePlanListDialog() {
  const [isOpen, setIsOpen] = useAtom(planListDialogAtom)
  return { isOpen, setIsOpen }
}
