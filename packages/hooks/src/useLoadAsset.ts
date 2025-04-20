import { STATIC_URL } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { Asset } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

export function useLoadAsset(asset: Asset) {
  const hash = asset.url.split('/').pop()!

  const { data, isLoading, ...rest } = useQuery({
    queryKey: ['asset', asset.url],
    queryFn: async () => {
      let url = `${STATIC_URL}${asset.url}`

      const res = await localDB.file.where({ hash }).first()

      try {
        if (res) {
          // url = URL.createObjectURL(res?.file!)
        } else {
          const blob = await fetch(`${STATIC_URL}${asset.url}`).then((res) =>
            res.blob(),
          )
          url = URL.createObjectURL(blob)

          const file = new File([blob], asset.filename!, { type: blob.type })
          await localDB.addFile(hash, file)
        }
      } catch (error) {
        console.log('=======error:', error)
      }

      return url
    },
  })

  return {
    isLoading,
    data,
    url: data || '',
    ...rest,
  }
}
