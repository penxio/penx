import { setConfig } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { PublishStructDialog } from '@penx/components/PublishStructDialog/PublishStructDialog'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { useQuerySession, useSession } from '@penx/session'
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

// function PanelApp() {
//   const {
//     isLoading,
//     data: isBoarded,
//     refetch,
//   } = useQuery({
//     queryKey: ['isFistTime'],
//     queryFn: async () => {
//       const isBoarded = localStorage.getItem('PENX_IS_BOARDED')
//       return !!isBoarded
//     },
//   })

//   if (isLoading) return null

//   if (!isBoarded) {
//     return <DesktopWelcome isLoading={isLoading} onGetStarted={refetch} />
//   }

//   return <CommandPalette />
// }
