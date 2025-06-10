import { atom, useAtom } from 'jotai'
import { IColumn } from '@penx/model-type'
import { Option } from '@penx/types'

type State = {
  isOpen: boolean
  option: Option
  column: IColumn
}

const drawerAtom = atom<State>({
  isOpen: false,
  option: null as any,
} as State)

export function useOptionDrawer() {
  const [state, setState] = useAtom(drawerAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
