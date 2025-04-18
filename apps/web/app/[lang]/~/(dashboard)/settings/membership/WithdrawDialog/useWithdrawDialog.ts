import { atom, useAtom } from 'jotai'

const withdrawDialogAtom = atom<boolean>(false)

export function useWithdrawDialog() {
  const [isOpen, setIsOpen] = useAtom(withdrawDialogAtom)
  return { isOpen, setIsOpen }
}
