import { atom, useAtom } from 'jotai'

const addSubscriberDialogAtom = atom<boolean>(false)

export function useAddSubscriberDialog() {
  const [isOpen, setIsOpen] = useAtom(addSubscriberDialogAtom)
  return { isOpen, setIsOpen }
}
