import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/db/client'

type State = {
  isOpen: boolean
  struct: Struct
}

const dialogAtom = atom<State>({
  isOpen: false,
  struct: null as any,
} as State)

export function useCreationTypeDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
