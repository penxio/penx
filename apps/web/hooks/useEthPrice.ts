import { useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'

export const ethPriceAtom = atom<number>(0 as number)

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useAtom(ethPriceAtom)
  return { ethPrice, setEthPrice }
}

export function useQueryEthPrice() {
  const { data, ...rest } = trpc.user.ethPrice.useQuery()

  useEffect(() => {
    if (typeof data !== 'undefined') {
      store.set(ethPriceAtom, data)
    }
  }, [data])
  return { data, ...rest }
}
