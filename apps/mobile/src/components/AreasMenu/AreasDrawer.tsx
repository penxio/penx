import { isIOS } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { DialogHeader } from '@penx/uikit/ui/dialog'
import { cn } from '@penx/utils'
import { Drawer as VaulDrawer } from '@penx/vaul'
import { useTheme } from '../theme-provider'
import { DrawerProvider } from '../ui/DrawerContext'

const platform = Capacitor.getPlatform()

interface Props {
  open: boolean
  setOpen: (isOpen: boolean) => void
  children: React.ReactNode
  className?: string
  isFullHeight?: boolean
}
export function AreasDrawer({
  open,
  setOpen,
  children,
  className,
  isFullHeight = false,
}: Props) {
  const { isDark } = useTheme()
  return (
    <DrawerProvider open={open} setOpen={setOpen}>
      <VaulDrawer.Root open={open} onOpenChange={setOpen}>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
          <VaulDrawer.Content
            className={cn(
              'text-foreground fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] flex-col bg-transparent px-4 pb-4',
              platform === 'ios' && 'max-h-[80vh]',
              isFullHeight && (isIOS ? 'min-h-[90vh]' : 'min-h-[90vh]'),
              className,
            )}
            style={{
              // boxShadow:
              //   '0 -4px 12px rgba(0, 0, 0, 0.05),    0 -8px 25px rgba(0, 0, 0, 0.1),0 -16px 50px rgba(0, 0, 0, 0.1)',
              filter: isDark
                ? 'drop-shadow(0 -8px 25px rgba(0, 0, 0, 0.4))'
                : 'drop-shadow(0 -8px 25px rgba(0, 0, 0, 0.18))',
            }}
          >
            <div className="rounded-2xl bg-white p-6 outline-none dark:bg-neutral-800">
              <DialogHeader className="hidden">
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              {children}
            </div>
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    </DrawerProvider>
  )
}
