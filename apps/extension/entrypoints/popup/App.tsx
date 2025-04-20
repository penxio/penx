import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import { LoadingDots } from '@/components/icons/loading-dots'
import { PopupContent } from '@/components/popup/PopupContent'
import { Providers } from '@/components/providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { useSession } from '@/hooks/useSession'
import { Button } from '@penx/uikit/ui/button'
import wxtLogo from '/wxt.svg'

// import './style.css'
function IndexPopupContent() {
  const { session, isLoading } = useSession()
  // console.log('=======session:', session, 'isLoading:', isLoading)

  if (isLoading) {
    return (
      <div className="item-center bg-background flex w-full flex-1 justify-center">
        <LoadingDots className="bg-foreground"></LoadingDots>
      </div>
    )
  }

  if (!session) return <Login />

  return <PopupContent />
}

function App() {
  return (
    <Providers>
      <ThemeProvider className="flex min-h-80 w-80 flex-col">
        <IndexPopupContent />
      </ThemeProvider>
    </Providers>
  )
}

export default App
