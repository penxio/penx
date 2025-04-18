'use client'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useSite } from '@/hooks/useSite'
import { api } from '@/lib/trpc'

export default function DeleteDomain({ domain }: { domain: string }) {
  const { refetch } = useSite()
  return (
    <div>
      <ConfirmDialog
        title="Unbind domain?"
        content="Are you sure you want to unbind this domain?"
        onConfirm={async () => {
          // alert(domain)
          await api.site.deleteDomain.mutate({ domain })
          await refetch()
        }}
      >
        <Button variant="destructive">Unbind domain</Button>
      </ConfirmDialog>
    </div>
  )
}
