import { Product } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  product: Product
}

const priceDialogAtom = atom<State>({
  isOpen: false,
  product: null as any,
} as State)

export function useProductPriceDialog() {
  const [state, setState] = useAtom(priceDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
