import { createConfig, http } from 'wagmi'
import { arbitrumSepolia, base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '75879ee8d0e1f47758a4bb4577361f08'

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [walletConnect({ projectId: projectId })],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
})
