import { DashboardProviders } from '@penx/components/DashboardProviders'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { WatchEvent } from '../WatchEvent'
import { CommandPalette } from './CommandPalette'

const windowHeight = 470
const searchBarHeight = 54
const footerHeight = 40

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
          <CommandPalette />
          <WatchEvent />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  )
}
