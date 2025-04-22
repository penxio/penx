import { getAreas } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'

export function useAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      // return getAreas()
      return localDB.area.toArray()
    },
  })
}
