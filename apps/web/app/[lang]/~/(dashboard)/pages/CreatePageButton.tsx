'use client'

import { useState } from 'react'
import LoadingCircle from '@penx/components/icons/loading-circle'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import { useDatabases } from '@penx/hooks/useDatabases'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useRouter } from '@penx/libs/i18n'
import { api } from '@penx/trpc-client'
import { toast } from 'sonner'

export function CreatePageButton() {
  const { push } = useRouter()
  const { refetch } = useDatabases()
  const [isLoading, setLoading] = useState(false)
  const site = useSiteContext()
  async function createPage() {
    setLoading(true)
    try {
      const page = await api.page.create.mutate({
        siteId: site.id,
        title: '',
      })
      push(`/~/page?id=${page.id}`)
      refetch()
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create page')
    }
    setLoading(false)
  }
  return (
    <Button
      className="flex w-32 gap-1"
      disabled={isLoading}
      onClick={createPage}
    >
      {!isLoading && <span>New Page</span>}
      {isLoading && <LoadingCircle></LoadingCircle>}
    </Button>
  )
}
