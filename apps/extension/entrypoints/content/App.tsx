import { useState } from 'react'
import { ContentView } from '@/components/content/ContentView'
import { Providers } from '@/components/providers'
import { ThemeProvider } from '@/components/ThemeProvider'

export default () => {
  return (
    <Providers>
      <ThemeProvider className="">
        <ContentView />
      </ThemeProvider>
    </Providers>
  )
}
