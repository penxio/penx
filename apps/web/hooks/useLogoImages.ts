import { useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { SpaceOnEvent } from '@/lib/types'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'

export const logoImagesAtom = atom<Record<string, string>>({})

export function useLogoImages() {
  const [logoImages, setLogoImages] = useAtom(logoImagesAtom)
  return {
    logoImages,
    setLogoImages,
  }
}

export function useQueryLogoImages(spaces: SpaceOnEvent[]) {
  const { data, ...rest } = trpc.space.logoImages.useQuery(
    spaces
      .map((space) => ({
        address: space.address,
        uri: space.uri,
      }))
      .filter((space) => space.uri),
    {
      enabled: spaces.length > 0,
    },
  )

  useEffect(() => {
    if (data) {
      // console.log('======data:', data)
      store.set(logoImagesAtom, data)
    }
  }, [data])
  return { data, ...rest }
}
