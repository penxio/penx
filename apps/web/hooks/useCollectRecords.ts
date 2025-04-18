import { PENX_SUBGRAPH_URL } from '@/lib/constants'
import { MintRecord } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useCollectRecords(creationId: string, enabled: boolean) {
  const query = gql`
    query getMintRecords($creationId: String!) {
      mintRecords(
        first: 1000
        orderBy: "timestamp"
        orderDirection: "desc"
        where: { creationId: $creationId }
      ) {
        id
        creationId
        minter
        curator
        amount
        price
      }
    }
  `

  const { data, ...rest } = useQuery<{ mintRecords: MintRecord[] }>({
    queryKey: ['mintRecords', creationId],
    async queryFn() {
      return request({
        url: PENX_SUBGRAPH_URL,
        document: query,
        variables: {
          creationId: creationId,
        },
      })
    },
    enabled,
  })

  const records: MintRecord[] = data?.mintRecords || []

  return { records, ...rest }
}
