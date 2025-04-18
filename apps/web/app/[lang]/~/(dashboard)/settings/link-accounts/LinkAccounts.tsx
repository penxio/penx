'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { PasswordDialog } from '@/components/PasswordDialog/PasswordDialog'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { ProviderType } from '@penx/db/client'
import { AccountList } from './AccountList'
import { LinkGoogleButton } from './LinkGoogleButton'
import { LinkPasswordButton } from './LinkPasswordButton'

export function LinkAccounts() {
  const { isLoading, data: accounts = [] } = useMyAccounts()

  const hasGoogleAccount = accounts.some(
    (a) => a.providerType === ProviderType.GOOGLE,
  )

  const hasPassword = accounts.some(
    (a) => a.providerType === ProviderType.PASSWORD,
  )

  return (
    <div className="">
      <PasswordDialog />

      {isLoading && <LoadingDots className="bg-foreground/60" />}
      {!isLoading && (
        <div className="grid w-full gap-6 md:w-[400px]">
          <AccountList />
          <div className="space-y-2">
            {!hasGoogleAccount && <LinkGoogleButton />}
            {!hasPassword && <LinkPasswordButton />}
          </div>
        </div>
      )}
    </div>
  )
}
