import { useQuery } from '@tanstack/react-query'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { MySite } from '@penx/types'
import { useMySites } from './useMySites'

const queryKey = ['current_site']

export function useQuerySite() {
  const { data: session } = useSession()

  const {
    data,
    isLoading,
    refetch: f,
    ...rest
  } = useQuery({
    queryKey,
    queryFn: async () => {
      return api.site.byId.query({ id: session?.activeSiteId })
    },
    enabled: !!session?.activeSiteId,
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
