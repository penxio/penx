import { atom, useAtom } from 'jotai'

type State = {
  open: boolean
  value: any
}

export const actionFilterAtom = atom<State>({
  open: false,
  value: '',
} as State)

export function useFilterPopover() {
  const [state, setState] = useAtom(actionFilterAtom)

  return {
    state,
    ...state,
    setOpen: (open: boolean) => setState({ ...state, open }),
    setValue: (value: boolean) => setState({ ...state, value }),
    setState,
  }
}
