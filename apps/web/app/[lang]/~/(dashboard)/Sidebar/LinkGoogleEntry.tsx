'use client'

import { IconGoogle } from '@/components/icons/IconGoogle'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { Link } from '@/lib/i18n'
import { ProviderType } from '@prisma/client'
import { ArrowRight } from 'lucide-react'

export function LinkGoogleEntry() {
  const { data: accounts = [], isLoading } = useMyAccounts()
  const hasGoogleAccount = accounts.some(
    (a) => a.providerType === ProviderType.GOOGLE,
  )
  if (hasGoogleAccount || isLoading) return null

  return (
    <Link
      href="/~/settings/link-accounts"
      className="bg-foreground/5 hover:bg-foreground/10 mt-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all"
    >
      <div className="text-foreground/80 space-y-1">
        <div className="flex items-center gap-2">
          <IconGoogle className="h-4 w-4" />
          <div className="text-base font-bold">Link Google</div>
        </div>
        <div className="text-foreground/60 text-xs leading-normal">
          Link to google account for easier mobile login.
        </div>
      </div>
      <ArrowRight size={20} className="text-foreground/50 shrink-0" />
    </Link>
  )
}
