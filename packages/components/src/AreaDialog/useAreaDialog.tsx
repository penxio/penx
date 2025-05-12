import { atom, useAtom } from 'jotai'
import { Area } from '@penx/domain'

type State = {
  isOpen: boolean
  area: Area
}

const dialogAtom = atom<State>({
  isOpen: false,
  area: null as any,
} as State)

export function useAreaDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
