'use client'

import { ICatalogueNode } from '@penx/model'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  parentId: string
  node?: ICatalogueNode
}

const nodeDialogAtom = atom<State>({
  isOpen: false,
  parentId: '',
} as State)

export function useUpdateNodeDialog() {
  const [state, setState] = useAtom(nodeDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
