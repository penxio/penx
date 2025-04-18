import { useSpaceContext } from '@/components/SpaceContext'
import { SUBGRAPH_URL } from '@/lib/constants'
import { Trade } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useTrades() {
  const space = useSpaceContext()

  const query = gql`
    query getTrades($spaceAddress: String!) {
      trades(
        first: 100
        orderBy: "timestamp"
        orderDirection: "desc"
        where: { space: $spaceAddress }
      ) {
        id
        account
        type
        tokenAmount
        ethAmount
        creatorFee
        protocolFee
        space {
          id
          address
        }
      }
    }
  `

  const { data, ...rest } = useQuery<{
    trades: Trade[]
  }>({
    queryKey: ['trades', space?.address],
    async queryFn() {
      return request({
        url: SUBGRAPH_URL,
        document: query,
        variables: {
          spaceAddress: space?.address!?.toLowerCase(),
        },
      })
    },
  })

  const trades: Trade[] = data?.trades || []

  return { trades, ...rest }
}
