import { useState } from 'react'
import { ContentView } from '@penx/components/content/ContentView'
import { Providers } from '@penx/components/providers'
import { ThemeProvider } from '@penx/components/ThemeProvider'

export default () => {
  return (
    <Providers>
      <ThemeProvider className="">
        <ContentView />
      </ThemeProvider>
    </Providers>
  )
}
