'use client'

import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  parentId: string
}

const addPostNodeDialogAtom = atom<State>({
  isOpen: false,
  parentId: '',
} as State)

export function useAddPageNodeDialog() {
  const [state, setState] = useAtom(addPostNodeDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
