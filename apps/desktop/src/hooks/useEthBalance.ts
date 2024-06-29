import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { useAccount } from 'wagmi'

export function useEthBalance() {
  const { address } = useAccount()

  return useQuery({
    queryKey: ['eth_balance', address],
    queryFn: async () => {
      const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
      })
      const data = await publicClient.getBalance({
        address: address!,
      })
      return data
    },
  })
}
