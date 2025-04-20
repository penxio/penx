'use client'

import { atom, useAtom } from 'jotai'

const subscriptionGuideDialogAtom = atom<boolean>(false)

export function useSubscriptionGuideDialog() {
  const [isOpen, setIsOpen] = useAtom(subscriptionGuideDialogAtom)
  return { isOpen, setIsOpen }
}
