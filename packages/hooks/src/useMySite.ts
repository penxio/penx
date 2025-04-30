import { useQuery } from '@tanstack/react-query'
import { set } from 'idb-keyval'
import { produce } from 'immer'
import { ACTIVE_SITE } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { AIProvider, ISite } from '@penx/model-type'
import { queryClient } from '@penx/query-client'
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

export function getSite() {
  return queryClient.getQueryData(queryKey) as ISite
}

export async function updateAIProvider(data: Partial<AIProvider>) {
  const site = getSite()
  const newSite = produce(site, (draft) => {
    if (!draft.aiProviders?.length) draft.aiProviders = []
    const index = draft.aiProviders.findIndex((p) => p.type === data.type)
    if (index === -1) {
      draft.aiProviders.push(data as AIProvider)
    } else {
      draft.aiProviders[index] = { ...draft.aiProviders[index], ...data }
    }

    if (Reflect.has(data, 'enabled') && data.enabled) {
      for (const item of draft.aiProviders) {
        item.enabled = item.type === data.type
      }
    }
  })

  queryClient.setQueryData(queryKey, newSite)

  await localDB.site.update(newSite.id, {
    aiProviders: newSite.aiProviders,
  })
  await set(ACTIVE_SITE, newSite)
}
