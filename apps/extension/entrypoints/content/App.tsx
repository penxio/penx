// import { useState } from 'react'
// import { ContentView } from '@/components/content/ContentView'
// import { ThemeProvider } from '@/components/ThemeProvider'
import { sendMessage } from '@/lib/message'
// import { QueryClientProvider } from '@tanstack/react-query'
// import { DashboardProviders } from '@penx/components/DashboardProviders'
import { initNodeModelApi } from '@penx/libs/initNodeModelApi'
// import { queryClient } from '@penx/query-client'
// import { StoreProvider } from '@penx/store'
import './style.css'

window.addEventListener('message', function (event) {
  if (
    event.data &&
    event.data.type === 'penx-logout' &&
    event.data.source === 'penx-account'
  ) {
    console.log('========event===:', event)
    sendMessage('logout', {})
  }

  if (
    event.data &&
    event.data.type === 'penx-login' &&
    event.data.source === 'penx-account'
  ) {
    console.log('========event===:', event)
    sendMessage('login', { session: event.data.payload })
  }
})

// initNodeModelApi()

export default () => {
  return <div></div>
  // return (
  //   <ThemeProvider>
  //     <QueryClientProvider client={queryClient}>
  //       <StoreProvider>
  //         <ContentView />
  //       </StoreProvider>
  //     </QueryClientProvider>
  //   </ThemeProvider>
  // )
}
