'use client'

import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/domain'

type State = {
  isOpen: boolean
  struct: Struct
}

const dialogAtom = atom<State>({
  isOpen: false,
  struct: undefined as any,
} as State)

export function useDeleteStructDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
