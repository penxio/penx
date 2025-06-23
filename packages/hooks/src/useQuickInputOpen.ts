import { atom, useAtom } from 'jotai'

type State = {
  open: boolean
  isTask: boolean
  date?: string
  cells?: any
}
const inputAtom = atom<State>({
  open: false,
  isTask: false,
  date: '',
})

export function useQuickInputOpen() {
  const [state, setState] = useAtom(inputAtom)

  return {
    ...state,
    setOpen: (open: boolean) => setState({ ...state, open }),
    setState,
  }
}
