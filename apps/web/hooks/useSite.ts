import { useSession } from '@/components/session'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { MySite } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useMySites } from './useMySites'

const queryKey = ['current_site']

export function useSite() {
  const { data: session } = useSession()
  const { data: sites = [] } = useMySites()

  const {
    data,
    isLoading,
    refetch: f,
    ...rest
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const site = sites.find((s) => s.id === session?.activeSiteId)
      const currentSite = site || sites[0]
      return currentSite
    },
    enabled: !!session?.activeSiteId && sites.length > 0,
  })

  async function refetch() {
    const res = await api.site.byId.query({ id: data!.id })
    queryClient.setQueriesData({ queryKey }, res)
  }

  return { site: data!, isLoading, refetch, ...rest }
}

export function getSite() {
  return queryClient.getQueryData(queryKey) as MySite
}

export function updateSiteState(data: Partial<MySite>) {
  const site = getSite()
  queryClient.setQueriesData(
    { queryKey },
    {
      ...site,
      ...data,
    },
  )
}
