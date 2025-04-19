import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import { Input } from '@penx/uikit/ui/input'
import { useCollaborators } from '@/hooks/useCollaborators'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { trpc } from '@penx/trpc-client'
import { toast } from 'sonner'

export default function AddCollaborator() {
  const [q, setQ] = useState('')
  const site = useSiteContext()
  const { refetch } = useCollaborators()
  const { mutateAsync, isPending } =
    trpc.collaborator.addCollaborator.useMutation()

  const add = async () => {
    if (!q.trim()) return toast.error('Please enter a valid address or email')
    try {
      await mutateAsync({ q, siteId: site.id })
      refetch()
      toast.success('Add collaborator successfully')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          placeholder="Enter wallet address or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button className="w-24" disabled={isPending || !q} onClick={add}>
          {isPending ? <LoadingDots /> : 'Add'}
        </Button>
      </div>
    </div>
  )
}
