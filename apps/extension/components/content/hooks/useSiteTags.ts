import { useSession } from '@/hooks/useSession'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { Tag } from '@penx/db/client'

export function useSiteTags() {
  const url = `${import.meta.env.PUBLIC_BASE_URL}/api/v1/tags`
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
