import { setConfig } from '@fower/react'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { PublishStructDialog } from '@penx/components/PublishStructDialog/PublishStructDialog'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { WatchEvent } from '../WatchEvent'
import { CommandPalette } from './CommandPalette'

const windowHeight = 470
const searchBarHeight = 54
const footerHeight = 40

setConfig({
  prefix: 'penx-',
})

export function Panel() {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <LocaleProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardProviders>
          <PublishStructDialog />
          <CommandPalette />
          <WatchEvent />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  )
}
