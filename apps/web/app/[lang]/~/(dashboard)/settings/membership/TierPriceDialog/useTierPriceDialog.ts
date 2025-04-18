import { Product } from '@penx/db/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  tier: Product
}

const priceDialogAtom = atom<State>({
  isOpen: false,
  tier: null as any,
} as State)

export function useTierPriceDialog() {
  const [state, setState] = useAtom(priceDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
