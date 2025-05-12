'use client'

import { atom, useAtom } from 'jotai'
import { Creation } from '@penx/domain'

type State = {
  isOpen: boolean
  creation: Creation
}

const dialogAtom = atom<State>({
  isOpen: false,
  creation: null as any,
} as State)

export function useDeleteCreationDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
