import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/db/client'
import { Prop } from '@penx/types'

type State = {
  isOpen: boolean
  prop: Prop
  struct: Struct
}

const dialogAtom = atom<State>({
  isOpen: false,
  prop: null as any,
  struct: null as any,
} as State)

export function usePropDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
