import { useState } from 'react'
import { ContentView } from '@/components/content/ContentView'
import { Providers } from '@/components/providers'
import { ThemeProvider } from '@/components/ThemeProvider'

export default () => {
  const [count, setCount] = useState(1)
  const increment = () => setCount((count) => count + 1)
  console.log('======>>>>>>>>>GOGO')

  return (
    <Providers>
      <ThemeProvider className="">
        <ContentView />
      </ThemeProvider>
    </Providers>
  )
}
