import { atom, useAtom } from 'jotai'

const inputAtom = atom({
  open: false,
  isTask: false,
})

export function useQuickInputOpen() {
  const [state, setState] = useAtom(inputAtom)

  return {
    ...state,
    setOpen: (open: boolean) => setState({ ...state, open }),
    setState,
  }
}
