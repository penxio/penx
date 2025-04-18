import { Area, Product } from '@penx/db/client'
import { atom, useAtom } from 'jotai'

export type AreaWithProduct = Area & {
  product?: Product
}

type State = {
  isOpen: boolean
  area: AreaWithProduct
}

const dialogAtom = atom<State>({
  isOpen: false,
  area: null as any,
} as State)

export function useAreaDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
