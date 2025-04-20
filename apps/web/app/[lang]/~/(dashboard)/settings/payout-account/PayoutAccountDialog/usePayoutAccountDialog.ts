import { PayoutAccount, Product } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  index?: number
  payoutAccount: PayoutAccount
}

const payoutAccountDialogAtom = atom<State>({
  isOpen: false,
  index: 0,
  payoutAccount: null as any,
} as State)

export function usePayoutAccountDialog() {
  const [state, setState] = useAtom(payoutAccountDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
