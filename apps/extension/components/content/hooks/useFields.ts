import { getFields } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export function useFields() {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      return getFields()
    },
  })
}
