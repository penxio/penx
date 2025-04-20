import { trpc } from '@penx/trpc-client'

export function useCollaborators() {
  return trpc.collaborator.listSiteCollaborators.useQuery(undefined, {
    staleTime: 1000 * 60,
  })
}
