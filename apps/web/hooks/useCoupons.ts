import { trpc } from '@/lib/trpc'

export function useCoupons() {
  return trpc.coupon.list.useQuery()
}
