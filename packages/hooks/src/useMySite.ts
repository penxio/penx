import { useQuery } from '@tanstack/react-query'
import { set } from 'idb-keyval'
import { ACTIVE_SITE } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'

const queryKey = ['current_site']

export function useMySite() {
  const { data: session } = useSession()

  const { data, isLoading, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      const site = await localDB.site.get(session.siteId)
      set(ACTIVE_SITE, site)
      return site
    },
    enabled: !!session?.siteId,
  })

  return { data, site: data!, isLoading, ...rest }
}
