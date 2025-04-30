import { atom, useAtom } from 'jotai'
import { IArea } from '@penx/model-type/IArea'

type State = {
  isOpen: boolean
  area: IArea
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
