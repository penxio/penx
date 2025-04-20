import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import { DashboardProviders } from '@penx/components/providers/DashboardProviders'
import { Button } from '@penx/uikit/ui/button'
import wxtLogo from '/wxt.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <DashboardProviders>
      <div className="bg-amber-100">
        <div>
          <a href="https://wxt.dev" target="_blank">
            {/* <img src={wxtLogo} className="logo" alt="WXT logo" /> */}
          </a>
          <a href="https://react.dev" target="_blank">
            {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
          </a>
        </div>
        <h1 className="font-black text-red-500">WXT + React!!!</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <Button>Hello world</Button>
        </div>
        <p className="read-the-docs">
          Click on the WXT and React logos to learn more
        </p>
      </div>
    </DashboardProviders>
  )
}

export default App
