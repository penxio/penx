import { trpc } from '@penx/trpc-client'

export function useCoupons() {
  return trpc.coupon.list.useQuery()
}
