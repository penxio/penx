import { useEffect } from 'react'
import { Space } from '@/domains/Space'
import { trpc } from '@/lib/trpc'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { useParams } from 'next/navigation'

export const spaceAtom = atom<Space>(null as any as Space)

export function useSpace() {
  const [space, setSpace] = useAtom(spaceAtom)
  return {
    space,
    setSpace,
  }
}

export function useQuerySpace() {
  const params = useParams() as Record<string, string>
  const address = params?.id as string

  const { data, ...rest } = trpc.space.getSpace.useQuery(
    { address },
    { enabled: !!address },
  )

  useEffect(() => {
    if (data) {
      store.set(spaceAtom, new Space(data))
    }
  }, [data])
  return { data, ...rest }
}
