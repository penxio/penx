import { atom, useAtom } from 'jotai'
import { IColumn } from '@penx/model-type'

type State = {
  isOpen: boolean
  column: IColumn
}

const drawerAtom = atom<State>({
  isOpen: false,
  column: null as any,
} as State)

export function useEditPropertyDrawer() {
  const [state, setState] = useAtom(drawerAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
