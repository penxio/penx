'use client'

import { atom, useAtom } from 'jotai'
import { IColumn } from '@penx/model-type'

type State = {
  isOpen: boolean
  column: IColumn
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
