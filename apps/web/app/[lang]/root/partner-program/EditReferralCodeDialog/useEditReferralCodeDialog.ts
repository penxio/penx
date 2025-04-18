import { atom, useAtom } from 'jotai'

const editCodeDialogAtom = atom<boolean>(false)

export function useEditReferralCodeDialog() {
  const [isOpen, setIsOpen] = useAtom(editCodeDialogAtom)
  return { isOpen, setIsOpen }
}
