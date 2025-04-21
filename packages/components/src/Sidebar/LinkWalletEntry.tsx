'use client'

import { IconGoogle } from '@penx/uikit/components/icons/IconGoogle'
import { useMyAccounts } from '@penx/hooks/useMyAccounts'
import { Link } from '@penx/libs/i18n'
import { ProviderType } from '@prisma/client'
import { ArrowRight } from 'lucide-react'

export function LinkWalletEntry() {
  const { data: accounts = [], isLoading } = useMyAccounts()
  const hasWallet = accounts.some((a) => a.providerType === ProviderType.WALLET)
  if (hasWallet || isLoading) return null
  return (
    <Link
      href="/~/settings/link-accounts"
      className="bg-foreground/5 hover:bg-foreground/10 mt-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all"
    >
      <div className="text-foreground/80 space-y-1">
        <div className="flex items-center gap-1">
          <span className="icon-[token--ethm] h-5 w-5"></span>
          <div className="text-base font-bold">Link wallet</div>
        </div>
        <div className="text-foreground/60 text-xs leading-normal">
          Link to wallet for easier claiming airdrop.
        </div>
      </div>
      <ArrowRight size={20} className="text-foreground/50 shrink-0" />
    </Link>
  )
}
