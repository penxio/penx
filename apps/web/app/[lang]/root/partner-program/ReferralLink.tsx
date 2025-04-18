'use client'

import { useMemo } from 'react'
import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { trpc } from '@/lib/trpc'
import { CopyIcon, PenSquareIcon } from 'lucide-react'
import { toast } from 'sonner'
import { EditReferralCodeForm } from './EditReferralCodeDialog/EditReferralCodeForm'
import { EditReferralCodeFormDialog } from './EditReferralCodeDialog/EditReferralCodeFormDialog'

export function ReferralLink() {
  const { copy } = useCopyToClipboard()
  const { session } = useSession()
  const { data } = trpc.user.getReferralCode.useQuery()
  const { setIsOpen } = useLoginDialog()

  const link = useMemo(() => {
    if (!session || !data) {
      return `${process.env.NEXT_PUBLIC_ROOT_HOST}?ref=******`
    }
    return `${process.env.NEXT_PUBLIC_ROOT_HOST}?ref=${data}`
  }, [session, data])

  return (
    <>
      <div className="flex h-12 items-center justify-center">
        <div className="border-foreground inline-flex items-center gap-2 rounded-full border-2 px-5 py-2">
          <span>{link}</span>
          <CopyIcon
            size={16}
            className="text-foreground/60 hover:text-foreground cursor-pointer"
            onClick={() => {
              if (!session) {
                return toast.info('Please sign in to copy referral link')
              }
              copy(link)
              toast.success('Referral link copied to clipboard')
            }}
          />

          <EditReferralCodeFormDialog />
        </div>
      </div>
      <div>
        <Button
          size="xl"
          className="px-8"
          onClick={() => {
            if (!session) {
              setIsOpen(true)
            } else {
              copy(link)
              toast.success('Referral link copied to clipboard')
            }
          }}
        >
          Start earning
        </Button>
      </div>
    </>
  )
}
