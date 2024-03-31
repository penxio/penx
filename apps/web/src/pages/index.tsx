import React, { PropsWithChildren, Suspense } from 'react'
import { Box } from '@fower/react'
import EditorApp from '@penx/app'
import { useSession } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { EarlyAccessCodeProvider } from '~/components/EarlyAccessCode/EarlyAccessCodeProvider'
import { FirstLocalSpaceGenerator } from '~/components/FirstLocalSpaceGenerator/FirstLocalSpaceGenerator'
import { MnemonicGenerator } from '~/components/MnemonicGenerator/MnemonicGenerator'
import { RecoveryPhraseLoginProvider } from '~/components/RecoveryPhraseLogin/RecoveryPhraseLoginProvider'
import { CommonLayout } from '~/layouts/CommonLayout'

const OnlineProvider = ({ children }: PropsWithChildren) => {
  const { data, loading } = useSession()
  if (loading) return null
  if (!navigator.onLine) return <>{children}</>

  // not logged in
  if (!data) {
    return <FirstLocalSpaceGenerator>{children}</FirstLocalSpaceGenerator>
  }

  return (
    <EarlyAccessCodeProvider>
      <MnemonicGenerator>
        <RecoveryPhraseLoginProvider>{children}</RecoveryPhraseLoginProvider>
      </MnemonicGenerator>
    </EarlyAccessCodeProvider>
  )
}

const PageEditor = () => {
  return (
    <StoreProvider>
      <OnlineProvider>
        <Suspense
          fallback={
            <Box h-100vh toCenterY black bgWhite>
              Loading...
            </Box>
          }
        >
          <EditorApp />
        </Suspense>
      </OnlineProvider>
    </StoreProvider>
  )
}

export default PageEditor

PageEditor.Layout = CommonLayout
