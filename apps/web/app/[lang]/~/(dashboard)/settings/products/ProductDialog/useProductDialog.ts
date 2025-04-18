import { Product } from '@penx/db/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  index: number
  product: Product
}

const productDialogAtom = atom<State>({
  isOpen: false,
  index: 0,
  product: null as any,
} as State)

export function useProductDialog() {
  const [state, setState] = useAtom(productDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
