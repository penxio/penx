import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Conf } from 'electron-conf/renderer'
import { PinIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { cn } from '@penx/utils'
import { AreasPopover } from '../AreasPopover'

const conf = new Conf()
export function QuickInputApp() {
  const { data: pinned, refetch } = useQuery({
    queryKey: ['input-window-pinned'],
    queryFn: async () => {
      const pinned = await conf.get('pinned')
      return !!pinned
    },
  })
  async function pinWindow() {
    await conf.set('pinned', !pinned)
    window.electron.ipcRenderer.send('pinned', !pinned)
    refetch()
  }
  return (
    <div
      className={cn(
        'drag bg-background fixed bottom-0 left-0 right-0 top-0 flex flex-col dark:bg-neutral-900/80',
      )}
    >
      <div className="flex items-center justify-between pl-1.5 pr-3 pt-2">
        <div>
          <AreasPopover />
        </div>
        <div className="text-foreground/60 flex items-center gap-1">
          <PinIcon
            className={cn(
              'no-drag size-4 cursor-pointer',
              pinned && 'text-brand',
            )}
            onClick={() => {
              pinWindow()
            }}
          />
          <XIcon
            className="no-drag size-4 cursor-pointer"
            onClick={() => {
              window.electron.ipcRenderer.send('hide-input-window')
            }}
          />
        </div>
      </div>
      <JournalQuickInput
        className="max-h-auto shadow-0 flex-1 rounded-none bg-transparent dark:bg-transparent"
        afterSubmit={() => {
          window.electron.ipcRenderer.send('quick-input-success')
          toast.success(
            <div className="bg-background shadow-popover inline-flex rounded-lg px-3 py-2 text-sm">
              <Trans>Created successfully</Trans>
            </div>,
            {
              unstyled: true,
              className: 'inline-flex justify-center',
              position: 'bottom-center',
            },
          )
        }}
      />
    </div>
  )
}
