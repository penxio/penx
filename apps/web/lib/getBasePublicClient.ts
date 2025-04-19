import { NetworkNames } from '@penx/constants'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

export function getBasePublicClient(network: string) {
  const baseClient = createPublicClient({
    chain: network === NetworkNames.BASE ? base : baseSepolia,
    transport: http(
      network === NetworkNames.BASE
        ? 'https://base-mainnet.g.alchemy.com/v2/gk85VnszAKLshOjVjaQyb_XyQxH93HTq'
        : 'https://base-sepolia.g.alchemy.com/v2/gk85VnszAKLshOjVjaQyb_XyQxH93HTq',
    ),
  })
  return baseClient
}
