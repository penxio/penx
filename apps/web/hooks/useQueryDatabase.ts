'use client'

import { api } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { useQuery } from '@tanstack/react-query'

export type Database = RouterOutputs['database']['byId']

type Options = {
  id?: string
  slug?: string
  fetcher?: () => Promise<Database>
}

export function useQueryDatabase({ id, slug, fetcher }: Options) {
  const uniqueId = id || slug
  return useQuery({
    queryKey: ['database', uniqueId],
    queryFn: async () => {
      if (typeof fetcher === 'function') {
        return await fetcher()
      }

      if (id) {
        return await api.database.byId.query(id)
      } else {
        return await api.database.bySlug.query(slug!)
      }
    },
    enabled: !!uniqueId,
  })
}
