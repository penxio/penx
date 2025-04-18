'use client'

import { atom, useAtom } from 'jotai'

const subscribeNewsletterDialogAtom = atom<boolean>(false)

export function useSubscribeNewsletterDialog() {
  const [isOpen, setIsOpen] = useAtom(subscribeNewsletterDialogAtom)
  return { isOpen, setIsOpen }
}
