'use client'

import { useState } from 'react'
import LoadingCircle from '@/components/icons/loading-circle'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/ui/components/button'
import { useDatabases } from '@/hooks/useDatabases'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useRouter } from '@/lib/i18n'
import { api } from '@/lib/trpc'
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
