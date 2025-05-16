import { atom, useAtom } from 'jotai'
import { Mold } from '@penx/db/client'

type State = {
  isOpen: boolean
  mold: Mold
}

const dialogAtom = atom<State>({
  isOpen: false,
  mold: null as any,
} as State)

export function useCreationTypeDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
