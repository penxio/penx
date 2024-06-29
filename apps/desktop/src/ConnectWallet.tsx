import { useAccount, WagmiProvider } from 'wagmi'
import { Account } from './account.tsx'
import { WalletOptions } from './wallet-options.tsx'

export function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}
