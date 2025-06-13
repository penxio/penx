import { isIOS } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Drawer as VaulDrawer } from 'vaul'
import { DialogHeader } from '@penx/uikit/ui/dialog'
import { cn } from '@penx/utils'
import { useTheme } from '../theme-provider'
import { DrawerProvider } from './DrawerContext'

const platform = Capacitor.getPlatform()

interface Props {
  open: boolean
  setOpen: (isOpen: boolean) => void
  children: React.ReactNode
  className?: string
  isFullHeight?: boolean
}
export function Drawer({
  open,
  setOpen,
  children,
  className,
  isFullHeight = false,
}: Props) {
  const { isDark } = useTheme()
  return (
    <DrawerProvider open={open} setOpen={setOpen}>
      <VaulDrawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
          <VaulDrawer.Content
            className={cn(
              'text-foreground fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] flex-col overflow-hidden rounded-t-2xl bg-neutral-100 px-4 pb-10 outline-none dark:bg-neutral-800',
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
            {/* <div
              aria-hidden
              className="bg-foreground/30 mx-auto mb-2 mt-2 h-1 w-10 shrink-0 rounded-full"
            /> */}

            <DialogHeader className="hidden">
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            {children}
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    </DrawerProvider>
  )
}
