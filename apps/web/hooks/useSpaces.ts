import { getSpaces } from '@/lib/getSpaces'
import { useQuery } from '@tanstack/react-query'

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      return getSpaces()
    },
  })
}
