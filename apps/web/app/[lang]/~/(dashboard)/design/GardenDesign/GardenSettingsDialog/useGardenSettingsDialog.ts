import { LayoutItem } from '@penx/types'
import { Product } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  layoutItem: LayoutItem
}

const dialogAtom = atom<State>({
  isOpen: false,
  layoutItem: null as any,
} as State)

export function useGardenSettingsDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
