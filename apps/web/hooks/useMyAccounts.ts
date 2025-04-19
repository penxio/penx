import { trpc } from '@penx/trpc-client'

export function useMyAccounts() {
  return trpc.user.accountsByUser.useQuery()
}
