import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trans } from '@lingui/react/macro'
import { SendIcon } from 'lucide-react'
import { SubmitFriendLinkForm } from './SubmitFriendLinkForm'
import { useSubmitFriendLinkDialog } from './useSubmitFriendLinkDialog'

export function SubmitFriendLinkDialog() {
  const { isOpen, setIsOpen } = useSubmitFriendLinkDialog()
  const { data } = useSession()
  const loginDialog = useLoginDialog()

  if (!data)
    return (
      <div>
        <Button
          variant="outline"
          className="flex gap-1"
          onClick={() => {
            loginDialog.setIsOpen(true)
          }}
        >
          <SendIcon size={16} />
          <span>
            <Trans>Submit Link</Trans>
          </span>
        </Button>
      </div>
    )

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <div>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-1">
            <SendIcon size={16} />
            <span>
              <Trans>Submit Link</Trans>
            </span>
          </Button>
        </DialogTrigger>
      </div>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>
            <Trans>Submit your link</Trans>
          </DialogTitle>
        </DialogHeader>
        <SubmitFriendLinkForm />
      </DialogContent>
    </Dialog>
  )
}
