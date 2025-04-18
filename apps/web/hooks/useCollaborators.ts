import { trpc } from '@/lib/trpc'

export function useCollaborators() {
  return trpc.collaborator.listSiteCollaborators.useQuery(undefined, {
    staleTime: 1000 * 60,
  })
}
