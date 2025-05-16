import { atom, useAtom } from 'jotai'
import { Mold } from '@penx/db/client'
import { Prop } from '@penx/types'

type State = {
  isOpen: boolean
  prop: Prop
  mold: Mold
}

const dialogAtom = atom<State>({
  isOpen: false,
  prop: null as any,
  mold: null as any,
} as State)

export function usePropDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
