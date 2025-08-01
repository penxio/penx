import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import { Login } from '@/components/Login'
import { PopupContent } from '@/components/popup/PopupContent'
import { ThemeProvider } from '@/components/ThemeProvider'
import { useSession } from '@/hooks/useSession'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LocaleProvider } from '@penx/locales'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'

// import './style.css'
function IndexPopupContent() {
  // const { session, isLoading } = useSession()

  // if (isLoading) {
  //   return (
  //     <div className="item-center bg-background flex w-full flex-1 justify-center">
  //       <LoadingDots className="bg-foreground"></LoadingDots>
  //     </div>
  //   )
  // }

  // if (!session) return <Login />

  return <PopupContent />
}

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider className="flex min-h-80 w-80 flex-col">
        <DashboardProviders>
          <IndexPopupContent />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
