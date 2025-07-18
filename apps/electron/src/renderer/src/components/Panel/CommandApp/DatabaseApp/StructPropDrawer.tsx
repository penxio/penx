import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { DialogHeader } from '@penx/uikit/ui/dialog'
import { cn } from '@penx/utils'
import { Drawer } from '@penx/vaul'
import { ColumnMenu } from './ColumnMenu/ColumnMenu'
import { useStructPropDrawer } from './useStructPropDrawer'

interface Props {
  children?: React.ReactNode
  className?: string
}
export function StructPropDrawer({}: Props) {
  const { open, column, index, setOpen } = useStructPropDrawer()

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed bg-black/40" />
        <Drawer.Content
          className="fixed bottom-2 right-2 top-2 z-10 flex w-[310px] outline-none"
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={
            { '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties
          }
        >
          <div className="bg-background shadow-popover flex h-full w-full grow flex-col rounded-[16px]">
            <div className="border-foreground/8 border-b px-4 pt-4">
              <Drawer.Title className="mb-2 font-medium text-zinc-900">
                {column?.name}
              </Drawer.Title>
              <Drawer.Description className="hidden"></Drawer.Description>
            </div>
            <ColumnMenu
              index={index}
              column={column}
              close={() => setOpen(false)}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
