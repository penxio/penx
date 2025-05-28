import { Capacitor } from '@capacitor/core'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Drawer as VaulDrawer } from 'vaul'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

interface Props {
  open: boolean
  setOpen: (isOpen: boolean) => void
  children: React.ReactNode
  className?: string
}
export function Drawer({ open, setOpen, children, className }: Props) {
  return (
    <VaulDrawer.Root open={open} onOpenChange={setOpen}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content
          className={cn(
            'bg-background text-foreground fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] min-h-[50vh] flex-col rounded-t-[10px] px-4 pb-6 outline-none',
            platform === 'ios' && 'max-h-[80vh]',
            className,
          )}
          style={{
            // boxShadow:
            //   '0 -4px 12px rgba(0, 0, 0, 0.05),    0 -8px 25px rgba(0, 0, 0, 0.1),0 -16px 50px rgba(0, 0, 0, 0.1)',
            filter: 'drop-shadow(0 -8px 25px rgba(0, 0, 0, 0.15))',
          }}
        >
          <div
            aria-hidden
            className="bg-foreground/30 mx-auto mb-4 mt-2 h-1 w-10 shrink-0 rounded-full"
          />

          <DialogTitle className="hidden"></DialogTitle>
          {children}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}
