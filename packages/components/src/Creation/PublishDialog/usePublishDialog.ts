import { atom, useAtom } from 'jotai'
import { Creation } from '@penx/db/client'

type State = {
  isOpen: boolean
  creation: Creation
}

const priceDialogAtom = atom<State>({
  isOpen: false,
  creation: null as any,
} as State)

export function usePublishDialog() {
  const [state, setState] = useAtom(priceDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
