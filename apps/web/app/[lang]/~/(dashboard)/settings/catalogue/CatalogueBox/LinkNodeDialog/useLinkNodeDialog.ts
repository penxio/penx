'use client'

import { ICatalogueNode } from '@penx/model-type'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  parentId: string
  node?: ICatalogueNode
}

const addCategoryNodeDialogAtom = atom<State>({
  isOpen: false,
  parentId: '',
} as State)

export function useLinkNodeDialog() {
  const [state, setState] = useAtom(addCategoryNodeDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
