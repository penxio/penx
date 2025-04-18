'use client'

import { RouterOutputs } from '@/server/_app'
import { atom, useAtom } from 'jotai'

type Asset = RouterOutputs['asset']['list'][0]

type State = {
  isOpen: boolean
  asset: Asset
}

const assetDialogAtom = atom<State>({
  isOpen: false,
  asset: null as any,
} as State)

export function useAssetDialog() {
  const [state, setState] = useAtom(assetDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
