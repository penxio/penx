'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useDatabases } from '@penx/hooks/useDatabases'
import { useRouter } from '@penx/libs/i18n'
import { api } from '@penx/trpc-client'
import LoadingCircle from '@penx/uikit/components/icons/loading-circle'
import { Button } from '@penx/uikit/ui/button'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

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
