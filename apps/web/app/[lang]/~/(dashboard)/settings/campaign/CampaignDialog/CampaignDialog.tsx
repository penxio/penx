import { Button } from '@penx/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/ui/components/dialog'
import { CampaignForm } from './CampaignForm'
import { useCampaignDialog } from './useCampaignDialog'

export function CampaignDialog() {
  const { isOpen, setIsOpen, campaign: campaign } = useCampaignDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{!!campaign ? 'Edit' : 'Create'} campaign</DialogTitle>
        </DialogHeader>
        <CampaignForm />
      </DialogContent>
    </Dialog>
  )
}
