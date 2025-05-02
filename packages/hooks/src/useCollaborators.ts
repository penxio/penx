import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'

export function useCollaborators() {
  const { data } = useSession()
  return trpc.collaborator.listSiteCollaborators.useQuery(undefined, {
    staleTime: 1000 * 60,
    enabled: !!data,
  })
}
