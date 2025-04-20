'use client'

import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  pageId: string
}

const deletePageDialogAtom = atom<State>({
  isOpen: false,
  pageId: '',
} as State)

export function useDeletePageDialog() {
  const [state, setState] = useAtom(deletePageDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
