'use client'

import { useEffect } from 'react'
import { useSession } from '@penx/session'
import { useRouter } from '@/lib/i18n'

export const dynamic = 'force-static'

export default function Page() {
  const { session } = useSession()
  const { push } = useRouter()
  useEffect(() => {
    if (!session) return push('/')
    push(`/~/areas/${session.activeAreaId}`)
  }, [session])
  return null
}
