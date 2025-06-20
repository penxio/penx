import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { queryClient } from '@penx/query-client'

const key = 'IS_GUIDE_ENTRY_HIDDEN'

export function useGuideEntryHidden() {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const hidden = await get(key)
      return hidden ?? false
    },
  })
}

export async function hideGuideEntry() {
  set(key, true)
  queryClient.setQueryData([key], true)
}
