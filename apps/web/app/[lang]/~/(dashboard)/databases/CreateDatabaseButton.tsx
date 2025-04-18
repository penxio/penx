'use client'

import { useState } from 'react'
import LoadingCircle from '@/components/icons/loading-circle'
import { useSiteContext } from '@/components/SiteContext'
import { useSubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Button } from '@/components/ui/button'
import { useDatabases } from '@/hooks/useDatabases'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useRouter } from '@/lib/i18n'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'

export function CreateDatabaseButton() {
  const { push } = useRouter()
  const site = useSiteContext()
  const { refetch } = useDatabases()
  const [isLoading, setLoading] = useState(false)
  async function createDatabase() {
    setLoading(true)
    try {
      const database = await api.database.create.mutate({
        siteId: site.id,
        name: '',
      })
      push(`/~/database?id=${database.id}`)
      refetch()
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create database')
    }
    setLoading(false)
  }
  return (
    <Button
      className="flex w-32 gap-1"
      disabled={isLoading}
      onClick={createDatabase}
    >
      {!isLoading && <span>New Database</span>}
      {isLoading && <LoadingCircle></LoadingCircle>}
    </Button>
  )
}
