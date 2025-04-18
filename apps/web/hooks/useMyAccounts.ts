import { trpc } from '@/lib/trpc'

export function useMyAccounts() {
  return trpc.user.accountsByUser.useQuery()
}
