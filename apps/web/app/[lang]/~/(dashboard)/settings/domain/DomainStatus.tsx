'use client'

import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import LoadingCircle from '@penx/uikit/loading-circle'
import { useDomainStatus } from '@penx/hooks/use-domain-status'

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain })

  return loading ? (
    <LoadingCircle />
  ) : status === 'Valid configuration' ? (
    <CheckCircle2
      fill="#2563EB"
      stroke="currentColor"
      className="text-background"
    />
  ) : status === 'Pending Verification' ? (
    <AlertCircle
      fill="#FBBF24"
      stroke="currentColor"
      className="text-background"
    />
  ) : (
    <XCircle fill="#DC2626" stroke="currentColor" className="text-background" />
  )
}
