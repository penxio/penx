import { trpc } from '@/lib/trpc'

export function useHomeSites() {
  return trpc.site.homeSites.useQuery()
}
