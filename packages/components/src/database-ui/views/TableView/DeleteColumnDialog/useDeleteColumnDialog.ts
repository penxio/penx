'use client'

import { atom, useAtom } from 'jotai'
import { Column } from '@penx/db/client'

type State = {
  isOpen: boolean
  column: Column
}

const dialogAtom = atom<State>({
  isOpen: false,
  column: null as any,
} as State)

export function useDeleteColumnDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
