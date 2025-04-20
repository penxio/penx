'use client'

import { Creation } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  creation: Creation
}

const dialogAtom = atom<State>({
  isOpen: false,
  creation: null as any,
} as State)

export function useDeletePostDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
