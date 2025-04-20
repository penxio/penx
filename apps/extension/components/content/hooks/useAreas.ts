import { getAreas } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export function useAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      return getAreas()
    },
  })
}
