import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/db/client'

type State = {
  isOpen: boolean
  struct: Struct
}

const addNoteDialogAtom = atom<State>({
  isOpen: false,
  struct: null as any,
} as State)

export function useAddNoteDialog() {
  const [state, setState] = useAtom(addNoteDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
