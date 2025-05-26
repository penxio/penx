import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { openUrl } from '@tauri-apps/plugin-opener'
import { nanoid } from 'nanoid'
import { SessionData } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import './style.css'
import ky from 'ky'
import { LoginStatus, ROOT_HOST } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { sleep } from '@penx/utils'

export function Login() {
  const { login } = useSession()
  const [loading, setLoading] = useState(false)
  async function loginToDesktop() {
    setLoading(true)
    const authToken = nanoid()
    const host = import.meta.env.VITE_ROOT_HOST
    openUrl(`${host}/desktop-login?token=${authToken}`)
    while (true) {
      try {
        const { status } = await ky
          .get(`${ROOT_HOST}/api/app/get-desktop-login-status`, {
            searchParams: { token: authToken },
          })
          .json<{ status: string }>()

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

    const session = await login({
      type: 'desktop-login',
      authToken,
    })

    appEmitter.emit('DESKTOP_LOGIN_SUCCESS', session)
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img className="size-20" src="https://penx.io/logo.png" alt="" />
        <h1 className="text-3xl font-bold">Welcome to PenX</h1>
        <p className="text-foreground/50 text-lg">
          Log in or create an account for creating
        </p>
        <Button
          size="xl"
          className="w-48"
          disabled={loading}
          onClick={() => {
            loginToDesktop()
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
