import { useSession } from '@/hooks/useSession'
import { BASE_URL } from '@/lib/constants'
import { Tag } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

export function useSiteTags() {
  const url = `${BASE_URL}/api/v1/tags`
  const { session } = useSession()
  return useQuery({
    queryKey: ['siteTags'],
    queryFn: async () => {
      const response = await ky.get(`${url}?siteId=${session.siteId}`).json()
      return response as Tag[]
    },
    enabled: !!session,
  })
}
