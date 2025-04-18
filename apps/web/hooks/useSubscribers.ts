import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'
import { SubscriberStatus } from '@penx/db/client'

interface UseSubscribersOptions {
  search?: string
  status?: SubscriberStatus
  limit?: number
}

export function useSubscribers(options: UseSubscribersOptions = {}) {
  const site = useSiteContext()
  const { search, status, limit = 20 } = options

  return trpc.subscriber.list.useInfiniteQuery(
    {
      siteId: site?.id,
      search,
      status,
      limit,
    },
    {
      enabled: !!site?.id,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )
}
