import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'

type State = {
  open: boolean
  column: IColumn
  index: number
}

const structPropDrawerAtom = atom<State>({
  open: false,
  column: null as any,
} as State)

export function useStructPropDrawer() {
  const [state, setState] = useAtom(structPropDrawerAtom)
  return {
    ...state,
    setOpen: (open: boolean) => setState({ ...state, open }),
    setState,
  }
}
