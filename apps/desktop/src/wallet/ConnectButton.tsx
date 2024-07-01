import { Box } from '@fower/react'
import { WalletConnectModal } from '@walletconnect/modal'
import { useChains, useConnect } from 'wagmi'
import { Button } from 'uikit'
import { IconWalletConnect } from '@penx/icons'

export function ConnectButton() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <Button
      key={connector.uid}
      colorScheme="neutral900"
      textSM
      variant="light"
      onClick={() => connect({ connector })}
    >
      <IconWalletConnect sky500 />
      <Box>Connect Wallet</Box>
    </Button>
  ))
}
