import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/domain'

type State = {
  isOpen: boolean
}

const dialogAtom = atom<State>({
  isOpen: false,
} as State)

export function useMyListDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
