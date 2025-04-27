import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { openUrl } from '@tauri-apps/plugin-opener'
import { nanoid } from 'nanoid'
import { api } from '@penx/trpc-client'
import { SessionData } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import './style.css'
import { LoginStatus } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { sleep } from '@penx/utils'

export function Login() {
  const [loading, setLoading] = useState(false)
  async function login() {
    setLoading(true)
    const authToken = nanoid()
    console.log('hello........')
    const host = import.meta.env.VITE_ROOT_HOST
    openUrl(`${host}/desktop-login?token=${authToken}`)

    while (true) {
      try {
        const { status } = await api.desktop.getLoginStatus.query({
          token: authToken,
        })

        // console.log('=======status:', status)

        if (status === LoginStatus.CONFIRMED) {
          break
        }

        if (status === LoginStatus.CANCELED) {
          setLoading(false)
          return
          // break
        }

        await sleep(1000)
      } catch (error) {
        console.log('error:', error)
        // toost
        setLoading(false)
        return
      }
    }

    const session = await api.desktop.loginByToken.mutate(authToken)
    console.log('===desktop=session:', session)

    appEmitter.emit('DESKTOP_LOGIN_SUCCESS', session)
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Welcome to PenX</h1>
        <p className="text-foreground/50 text-lg">
          Log in or create an account for creating
        </p>
        <Button
          size="xl"
          className="w-48"
          disabled={loading}
          onClick={() => {
            login()
          }}
        >
          {loading ? (
            <LoadingDots className="bg-background" />
          ) : (
            'Log in with browser'
          )}
        </Button>
      </div>
    </main>
  )
}
