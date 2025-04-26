import { redisKeys } from '@penx/constants'
import Redis from 'ioredis'
import { create } from 'kubo-rpc-client'
import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import NextCors from 'nextjs-cors'
import { Address } from 'viem'

const redis = new Redis(process.env.REDIS_URL!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }

  const cid = await addToIpfsServer(req.body)

  const address = req.query?.address as Address
  if (address) {
    const key = redisKeys.site(address.toLowerCase())
    await redis.del(key)
    await redis.del(redisKeys.spaceLogo(address.toLowerCase()))
  }
  res.json({
    cid,
    url: `https://ipfs-gateway.spaceprotocol.xyz/ipfs/${cid.toString()}`,
  })
}

async function addToIpfsServer(value: string) {
  const client = create(new URL(process.env.NEXT_PUBLIC_IPFS_API!))
  const { cid } = await client.add(
    {
      content: typeof value === 'object' ? JSON.stringify(value) : value,
    },
    { pin: true },
  )
  return cid.toString()
}
