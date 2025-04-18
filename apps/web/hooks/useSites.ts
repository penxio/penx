import { api, trpc } from '@/lib/trpc'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useSites() {
  // const res = useInfiniteQuery({
  //   queryKey: ['sites'],
  //   initialPageParam: 1,
  //   queryFn: () => {
  //     return api.site.list.query({
  //       pageNum: 1,
  //       pageSize: 3,
  //     })
  //   },
  //   getNextPageParam: (lastPage) => {
  //     // return lastPage.sites < lastPage.count
  //     return 2
  //   },
  // })

  // return res
  return trpc.site.listWithPagination.useQuery({
    pageNum: 1,
    pageSize: 36,
  })
}
