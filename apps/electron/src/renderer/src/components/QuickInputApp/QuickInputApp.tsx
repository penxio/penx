import { Trans } from '@lingui/react/macro'
import { PinIcon, PinOffIcon, XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { appEmitter } from '@penx/emitter'
import { LocaleProvider } from '@penx/locales'
import { cn } from '@penx/utils'
import { AreasPopover } from '../AreasPopover'

export function QuickInputApp() {
  return (
    <LocaleProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardProviders>
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
                <PinIcon className="no-drag size-4 cursor-pointer" />
                <XIcon
                  className="no-drag size-4 cursor-pointer"
                  onClick={() => {
                    window.electron.ipcRenderer.send('close-input-window')
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
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  )
}
