'use client'

import { ConfirmDialog } from '@penx/components/ConfirmDialog'
import { Button } from '@penx/uikit/ui/button'
import { useSite } from '@penx/hooks/useSite'
import { api } from '@penx/trpc-client'

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
