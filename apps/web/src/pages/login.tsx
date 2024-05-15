import { Suspense, useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'uikit'
import { useHideLogoLoader } from '@penx/hooks'
import { IconWallet } from '@penx/icons'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'
import { LoginForm } from '~/components/LoginForm/LoginForm'
import LoginWithGoogleButton from '~/components/LoginWithGoogleButton'
import { Logo } from '~/components/Logo'
import { SiweModal } from '~/components/SiweModal'
import { WalletConnectButton } from '~/components/WalletConnectButton'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

const isHosted = process.env.NEXT_PUBLIC_DEPLOY_MODE === 'SELF_HOSTED'

export default function LoginPage() {
  const { push } = useRouter()

  useHideLogoLoader()

  const loginEntry = useMemo(() => {
    if (isHosted) {
      return <LoginForm />
    }

    return (
      <Box column gap2 toCenterX>
        <SiweModal />

        <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
          <LoginWithGoogleButton />
        </Suspense>
        {/* <ClientOnly>
          <WalletConnectButton size="lg" colorScheme="white" w-240 roundedXL>
            <IconWallet size={24} />
            <Box textBase fontNormal>
              Login with Wallet
            </Box>
          </WalletConnectButton>
        </ClientOnly> */}
      </Box>
    )
  }, [])

  return (
    <ClientOnly>
      <ToastContainer position="bottom-right" />
      <TrpcProvider>
        <WalletConnectProvider>
          <Box column h-100vh>
            <Box mx-auto py8 toCenter>
              <Logo to="/" />
            </Box>
            <Box column flex-1 toCenter>
              <Box
                toCenter
                py10
                rounded3XL
                mx-auto
                bgWhite
                column
                mt--200
                // border
                w={['100%', '100%', 480]}
              >
                <Box as="h1" fontBold>
                  Welcome to PenX
                </Box>
                <Box as="p" textCenter mb6 leadingNormal px10 gray500 textBase>
                  Your personal database
                </Box>

                {loginEntry}

                {!isHosted && <TermsOfService />}
              </Box>
            </Box>
          </Box>
        </WalletConnectProvider>
      </TrpcProvider>
    </ClientOnly>
  )
}

function TermsOfService() {
  return (
    <Box gray400 textSM maxW-260 mt5 textCenter leadingTight>
      By creating an account you agree to our{' '}
      <Box
        as="a"
        href="https://www.penx.io/privacy"
        target="_blank"
        brand500
        noUnderline
        underline--hover
      >
        privacy policy
      </Box>{' '}
      and{' '}
      <Box
        as="a"
        href="https://www.penx.io/terms"
        target="_blank"
        brand500
        noUnderline
        underline--hover
      >
        terms of service
      </Box>
      .
    </Box>
  )
}
