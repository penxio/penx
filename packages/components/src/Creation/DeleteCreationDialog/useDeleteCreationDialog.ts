'use client'

import { atom, useAtom } from 'jotai'
import { ICreation } from '@penx/model-type/ICreation'

type State = {
  isOpen: boolean
  creation: ICreation
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
