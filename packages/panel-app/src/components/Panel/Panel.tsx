import { PropsWithChildren } from 'react'
import { setConfig } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { createStore, Provider, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { PublishStructDialog } from '@penx/components/PublishStructDialog/PublishStructDialog'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { useQuerySession, useSession } from '@penx/session'
import { panelAtom, PanelState, usePanel } from '../../hooks/usePanel'
import { WatchEvent } from '../WatchEvent'
import { CommandPalette } from './CommandPalette'

setConfig({
  prefix: 'penx-',
})

interface Props extends Partial<PanelState> {}

export function Panel(props: Props) {
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
          <HydrateAtoms {...props}>
            <CommandPalette />
          </HydrateAtoms>
          <WatchEvent />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  )
}

function HydrateAtoms({
  children,
  location = 'normal',
}: PropsWithChildren<Props>) {
  useHydrateAtoms([[panelAtom, { location }]])
  return <>{children}</>
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
