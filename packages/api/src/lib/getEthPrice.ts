import { precision } from '@penx/math'
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

const priceAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'priceFeedAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getChainlinkLatestPrice',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
] as const

export async function getEthPrice(): Promise<number> {
  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(
      'https://arb-mainnet.g.alchemy.com/v2/gk85VnszAKLshOjVjaQyb_XyQxH93HTq',
    ),
  })

  const price = await publicClient.readContract({
    address: '0xC770C4855D0adEB9b7a792FCbaaE6030C5458D72',
    abi: priceAbi,
    functionName: 'getChainlinkLatestPrice',
    args: ['0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'],
  })

  try {
    const ethPrice = precision.toDecimal(price, 8)
    return ethPrice
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    throw new Error('Failed to fetch ETH price')
  }
}
