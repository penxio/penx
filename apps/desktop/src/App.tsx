import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { openUrl } from '@tauri-apps/plugin-opener'
import { open } from '@tauri-apps/plugin-shell'
import { nanoid } from 'nanoid'
import { Button } from '@penx/uikit/ui/button'
import reactLogo from './assets/react.svg'
import './style.css'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }))
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Welcome to PenX</h1>
        <p className="text-foreground/50 text-lg">
          Log in or create an account for creating
        </p>
        <Button
          size="lg"
          className=""
          onClick={() => {
            console.log('hello........')
            const host =
              import.meta.env.VITE_BASE_URL || 'http://localhost:4000'
            openUrl(`${host}/desktop-login?token=${nanoid()}`)
          }}
        >
          Log in with browser
        </Button>
      </div>
    </main>
  )
}

export default App
