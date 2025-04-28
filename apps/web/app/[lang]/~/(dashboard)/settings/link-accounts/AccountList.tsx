'use client'

import { Account, ProviderType } from '@penx/db/client'
import { AvatarImage } from '@radix-ui/react-avatar'
import { KeyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useMyAccounts } from '@penx/hooks/useMyAccounts'
import { trpc } from '@penx/trpc-client'
import { IconGoogle } from '@penx/uikit/components/icons/IconGoogle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Avatar, AvatarFallback } from '@penx/uikit/ui/avatar'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { shortenAddress } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

function AccountItem({ account }: { account: Account }) {
  const { refetch } = useMyAccounts()
  const { isPending, mutateAsync } = trpc.user.disconnectAccount.useMutation()
  const info = account.providerInfo as any
  const removeButton = (
    <Button
      disabled={isPending}
      size="xs"
      className="w-20"
      variant="outline"
      onClick={async () => {
        try {
          await mutateAsync({ accountId: account.id })
          await refetch()
          toast.success('Removed successfully')
        } catch (error) {
          const msg = extractErrorMessage(error)
          toast.error(msg || 'Failed to remove account')
        }
      }}
    >
      {isPending && <LoadingDots className="bg-foreground/60" />}
      {!isPending && 'remove'}
    </Button>
  )
  if (account.providerType === ProviderType.GOOGLE) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <IconGoogle className="h-4 w-4" />
            <span>Google</span>
          </Badge>
          <Avatar className="h-6 w-6">
            <AvatarImage src={info?.picture} />
            <AvatarFallback>{info?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>{info?.email}</div>
        </div>
        {removeButton}
      </div>
    )
  }

  if (account.providerType === ProviderType.WALLET) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <span className="icon-[token--ethm] h-4 w-4"></span>
            <span>Wallet</span>
          </Badge>
          <Avatar className="h-6 w-6">
            <AvatarImage src={info?.picture} />
            <AvatarFallback>{info?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="">{shortenAddress(account.providerAccountId)}</div>
        </div>
        {removeButton}
      </div>
    )
  }
  if (account.providerType === ProviderType.PASSWORD) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <KeyIcon size={14} />
            <span>Password</span>
          </Badge>
          <Avatar className="h-6 w-6">
            <AvatarImage src={info?.picture} />
            <AvatarFallback>
              {account.providerAccountId?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="">{account.providerAccountId}/---</div>
        </div>
        {removeButton}
      </div>
    )
  }
  return null
}

export function AccountList() {
  const { isLoading, data = [] } = useMyAccounts()

  if (isLoading) return null

  return (
    <div>
      <div className="mb-3 text-lg font-bold">Linked account</div>
      <div className="grid gap-4">
        {data.map((account) => {
          return <AccountItem key={account.id} account={account} />
        })}
      </div>
    </div>
  )
}
