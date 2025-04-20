'use client'

import { ICatalogueNode } from '@penx/model'
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

export function useCategoryNodeDialog() {
  const [state, setState] = useAtom(addCategoryNodeDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
