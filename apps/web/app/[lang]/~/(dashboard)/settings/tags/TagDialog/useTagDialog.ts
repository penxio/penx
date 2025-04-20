import { Tag } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  index: number
  tag: Tag
}

const dialogAtom = atom<State>({
  isOpen: false,
  index: 0,
  tag: null as any,
} as State)

export function useTagDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
