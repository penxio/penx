'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import { useDeployNewSiteDialog } from './useDeployNewSiteDialog'

interface Props {}

export function DeployNewSiteDialog({}: Props) {
  const { isOpen, setIsOpen } = useDeployNewSiteDialog()
  const { isPending, mutateAsync } = trpc.hostedSite.deployNewSite.useMutation()
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-8 sm:max-w-[425px]">
        <DialogHeader className="">
          <DialogTitle className="text-3xl font-bold">
            Deploy new site
          </DialogTitle>
          <DialogDescription>
            Deploy your own site to Cloudflare Pages in 10 minutes
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3">
          <DialogClose asChild className="w-full">
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={async () => {
              try {
                const res = await mutateAsync({})
                refetch()
                toast.success('Deployment created!')
                setIsOpen(false)
              } catch (error) {
                toast.error(extractErrorMessage(error))
              }
            }}
          >
            {isPending ? <LoadingDots className=""></LoadingDots> : 'Deploy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
