import { useQuery } from '@tanstack/react-query'
import { api } from '@penx/api'

export function useStructTemplates() {
  return useQuery({
    queryKey: ['structTemplates'],
    queryFn: async () => {
      return api.listStructTemplate()
    },
  })
}
