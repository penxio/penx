import { atom, useAtom } from 'jotai'

const switchChainDialogAtom = atom<boolean>(false)
export function useSwitchChainDialog() {
  const [isOpen, setIsOpen] = useAtom(switchChainDialogAtom)
  return { isOpen, setIsOpen }
}
