import { spaceAbi } from '@/lib/abi'
import {
  IPFS_GATEWAY,
  NETWORK,
  NetworkNames,
  SUBGRAPH_URL,
} from '@penx/constants'
import { getBasePublicClient } from '@/lib/getBasePublicClient'
import { redisKeys } from '@/lib/redisKeys'
import { SpaceInfo, SpaceOnEvent, SpaceType } from '@penx/types'
import { gql, request } from 'graphql-request'
import Redis from 'ioredis'
import ky from 'ky'
import pRetry, { AbortError } from 'p-retry'
import { Address } from 'viem'
import { z } from 'zod'
import { getEthPrice } from '../lib/getEthPrice'
import { publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const publicClient = getBasePublicClient(NETWORK)

const spaceQuery = gql`
  query space($id: String!) {
    space(id: $id) {
      id
      spaceId
      address
      founder
      symbol
      name
      preBuyEthAmount
      ethVolume
      tokenVolume
      tradeCreatorFee
      memberCount
      uri
      members {
        id
      }
    }
  }
`

export const spaceRouter = router({
  getSpace: publicProcedure
    .input(
      z.object({
        chainId: z.number().optional(),
        address: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { chainId } = input
      const address = input.address.toLowerCase() as Address
      const key = redisKeys.site(address)
      const ttl = 60 * 5 //  5 minutes

      const cachedSpace = await redis.get(key)

      if (typeof cachedSpace === 'string' && cachedSpace.length > 0) {
        // return JSON.parse(cachedSpace) as SpaceType
      }

      const [res1, res2] = await Promise.all([
        publicClient.multicall({
          contracts: [
            {
              address: address as Address,
              abi: spaceAbi,
              functionName: 'token',
            },
            {
              address: address as Address,
              abi: spaceAbi,
              functionName: 'config',
            },
            {
              address: address as Address,
              abi: spaceAbi,
              functionName: 'name',
            },
            {
              address: address as Address,
              abi: spaceAbi,
              functionName: 'symbol',
            },
            {
              address: address as Address,
              abi: spaceAbi,
              functionName: 'totalSupply',
            },
            {
              address: address as Address,
              abi: spaceAbi,
              functionName: 'owner',
            },
          ],
          allowFailure: false,
        }),

        pRetry(async () => fetchSpace(address), {
          retries: 10,
        }),
      ])

      const uri = res1[1][0]
      const stakingRevenuePercent = res1[1][1]

      let spaceInfo = {} as SpaceInfo
      if (uri) {
        spaceInfo = await ky
          .get(`${IPFS_GATEWAY}/ipfs/${uri}`)
          .json<SpaceInfo>()
      }

      const space = {
        ...res2,
        address: address,
        x: res1[0][0].toString(),
        y: res1[0][1].toString(),
        k: res1[0][2].toString(),
        uri,
        stakingRevenuePercent: stakingRevenuePercent.toString(),
        symbol: res1[3],
        totalSupply: res1[4].toString(),
        owner: res1[5],
        ...spaceInfo,
        name: spaceInfo?.name || res1[2] || res2?.name,
      } as SpaceType

      await redis.set(key, JSON.stringify(space), 'EX', ttl)
      return space
    }),

  logoImages: publicProcedure
    .input(
      z.array(
        z.object({
          address: z.string(),
          uri: z.string().optional(),
        }),
      ),
    )
    .query(async ({ input }) => {
      const ttl = 60 * 60 // 60 minutes
      const logo: Record<string, string> = {}

      for (const item of input) {
        if (!item.uri) continue

        const key = redisKeys.spaceLogo(item.address)
        const cid = await redis.get(key)

        if (typeof cid === 'string' && cid.length > 0) {
          logo[item.address] = cid
        } else {
          const url = IPFS_GATEWAY + '/ipfs/' + item.uri!
          const res = await ky.get(url).json<{ logo: string }>()

          await redis.set(key, res.logo, 'EX', ttl)
          logo[item.address] = res.logo
        }
      }

      return logo
    }),

  ethPrice: publicProcedure.query(() => {
    return getEthPrice()
  }),
})

async function fetchSpace(address: string) {
  const { space } = await request<{ space: SpaceOnEvent }>({
    url: SUBGRAPH_URL,
    document: spaceQuery,
    variables: {
      id: address.toLowerCase(),
    },
  })

  // Abort retrying if the resource doesn't exist
  if (!space) {
    throw new AbortError('Failed to fetch space')
  }

  return space
}
