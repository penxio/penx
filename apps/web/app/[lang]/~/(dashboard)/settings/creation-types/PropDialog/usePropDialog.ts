import { Prop } from '@penx/types'
import { Mold } from '@prisma/client'
import { atom, useAtom } from 'jotai'

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
