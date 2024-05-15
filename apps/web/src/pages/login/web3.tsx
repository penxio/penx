import { Suspense, useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { ArrowRight, Wallet } from 'lucide-react'
import { useRouter } from 'next/router'
import { ClientOnly } from '~/components/ClientOnly'
import LoginWithGoogleButton from '~/components/LoginWithGoogleButton'
import { Logo } from '~/components/Logo'
import { SiweModal } from '~/components/SiweModal'
import { WalletConnectButton } from '~/components/WalletConnectButton'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

export default function LoginPage() {
  const { push } = useRouter()

  const loginEntry = useMemo(() => {
    return (
      <Box column gap2 toCenterX>
        <SiweModal />

        <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
          <LoginWithGoogleButton />
        </Suspense>
        <ClientOnly>
          <WalletConnectButton
            size={56}
            roundedFull
            colorScheme="white"
            toBetween
          >
            <Wallet />
            <Box column gap1>
              <Box textBase fontSemibold>
                Login with Wallet
              </Box>
              <Box gray800 textXS fontLight>
                For web3 users and builders
              </Box>
            </Box>
          </WalletConnectButton>
        </ClientOnly>
      </Box>
    )
  }, [])

  return (
    <ClientOnly>
      <WalletConnectProvider>
        <Box column h-100vh>
          <Box mx-auto py8 toCenter>
            <Logo to="/" />
          </Box>
          <Box column flex-1 toCenter>
            <Box
              toCenter
              py10
              roundedXL
              mx-auto
              bgWhite
              column
              mt--200
              w={['100%', '100%', 480]}
            >
              <Box as="h1" fontBold>
                Welcome to PenX
              </Box>
              <Box as="p" textCenter mb6 leadingNormal px10 gray500>
                Your personal database
              </Box>

              {loginEntry}
            </Box>
          </Box>
        </Box>
      </WalletConnectProvider>
    </ClientOnly>
  )
}
