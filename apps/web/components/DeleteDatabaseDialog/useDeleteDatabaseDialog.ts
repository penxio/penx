'use client'

import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  databaseId: string
}

const deleteDatabaseDialogAtom = atom<State>({
  isOpen: false,
  databaseId: '',
} as State)

export function useDeleteDatabaseDialog() {
  const [state, setState] = useAtom(deleteDatabaseDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
