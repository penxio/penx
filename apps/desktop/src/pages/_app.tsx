import '~/styles/globals.css'
import '~/styles/command.scss'
import { useEffect, useState } from 'react'
import { register, unregister } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ToastContainer } from 'uikit'
import { initFower } from '@penx/app'
import { appEmitter } from '@penx/event'
import { clearAuthorizedUser } from '@penx/storage'
import { store, StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'
import '@glideapps/glide-data-grid/dist/index.css'
import { app } from '@tauri-apps/api'
import { emit, listen } from '@tauri-apps/api/event'
import { AppEvent, isServer } from '@penx/constants'
import { db } from '@penx/local-db'

initFower()

const isDev = process.env.NODE_ENV === 'development'

async function listenForHotkey(shortcut: string) {
  const { appWindow, WebviewWindow } = await import('@tauri-apps/api/window')

  await register(shortcut, async () => {
    if (document.hasFocus()) {
      await appWindow.hide()
    } else {
      const appWindow = WebviewWindow.getByLabel('main')
      await appWindow?.show()
      // await appWindow?.center()
      await appWindow?.setFocus()
      setTimeout(() => {
        console.log('--------------searchBarInput focus')
        document.getElementById('searchBarInput')?.focus()
      }, 0)
    }
  })
}

async function hideOnBlur() {
  const { appWindow, WebviewWindow } = await import('@tauri-apps/api/window')
  const mainWindow = WebviewWindow.getByLabel('main')

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      mainWindow?.hide()
      appEmitter.emit('ON_MAIN_WINDOW_HIDE')
    }
  })

  listen('tauri://blur', () => {
    // console.log('---------appWindow:', appWindow)
    if (!isDev) {
      appWindow.hide()
    }
  })
}

async function init() {
  console.log('app init............')

  const shortcut = 'CommandOrControl+;'

  unregister(shortcut).then(() => {
    listenForHotkey(shortcut)
  })

  hideOnBlur()

  type Payload = {
    code: string
    commands: string
    id: string
    name: string
    icon: string
    version: string
  }

  const { appWindow, WebviewWindow } = await import('@tauri-apps/api/window')

  if (appWindow.label === 'main') {
    listen(AppEvent.UPSERT_EXTENSION, async (data) => {
      const payload = data.payload as Payload
      const commands = JSON.parse(payload.commands || '[]')

      await db.upsertExtension(payload.id, {
        commands: commands,
        name: payload.name,
        icon: payload.icon,
        version: payload.version,
      })
    })
  }

  listen('PreferencesClicked', (data) => {
    console.log('PreferencesClicked==========:', data.payload)
  })

  listen('MenuEditorClicked', (data) => {})
}

if (!isServer) {
  init()
}

function MyApp({ Component, pageProps }: AppProps) {
  const { push } = useRouter()

  useEffect(() => {
    const handleSignOut = () => {
      clearAuthorizedUser()
      store.setToken(null as any)
      push('/')
    }

    appEmitter.on('SIGN_OUT', handleSignOut)
    return () => {
      appEmitter.off('SIGN_OUT', handleSignOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    invoke<string>('greet', { name: 'Next.js' })
      .then((result) => {
        console.log('resu=lt', result)

        setGreeting(result)
      })
      .catch(console.error)
  }, [])

  return (
    <ClientOnly>
      <StoreProvider>
        <TrpcProvider>
          <ToastContainer position="bottom-right" />
          <Component {...pageProps} />
        </TrpcProvider>
      </StoreProvider>
    </ClientOnly>
  )
}

export default MyApp
