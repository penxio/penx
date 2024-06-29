import { useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { ToastContainer } from 'uikit'
import { appEmitter } from '@penx/event'
import { StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import '@glideapps/glide-data-grid/dist/index.css'
import { fixPathEnv } from 'tauri-plugin-shellx-api'
import { registerDefaultAppHotkey } from '@penx/app'
import { handleEscape } from './common/handleEscape'
import { initApplicationCommands } from './common/initApplicationCommands'
import { initFower } from './common/initFower'
import { initHotkeys } from './common/initHotkeys'
import { installBuiltinExtension } from './common/installBuiltinExtension'
import { watchDesktopLogin } from './common/watchDesktopLogin'
import { watchExtensionDevChange } from './common/watchExtensionDevChange'
import { useInitThemeMode } from './hooks/useInitThemeMode'
import { MainApp } from './MainApp'
import '~/styles/globals.css'
import '~/styles/command.scss'
import { config } from './config'

initFower()

async function init() {
  handleEscape()
  watchExtensionDevChange()
  watchDesktopLogin()
  registerDefaultAppHotkey()
  installBuiltinExtension()
  initHotkeys()
  initApplicationCommands()
}

init()

function MyApp() {
  useEffect(() => {
    fixPathEnv() // without this, PATH variable may not be loaded and thus non-system shell commands may fail
    const handleSignOut = async () => {
      // const user = store.user.getUser()
      // await setMnemonicToLocal(user.id, '')
      // await clearAuthorizedUser()
      // await setLocalSession(null as any)
      // store.setToken(null as any)
      // store.user.setUser(null as any)
      // store.user.setMnemonic('')
      // appEmitter.emit('SIGN_OUT_SUCCESSFULLY')
    }
    appEmitter.on('SIGN_OUT', handleSignOut)
    return () => {
      appEmitter.off('SIGN_OUT', handleSignOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useInitThemeMode()

  return (
    <StoreProvider>
      <WagmiProvider config={config}>
        <TrpcProvider>
          <ToastContainer position="bottom-right" />
          <MainApp />
          <div id="portal" />
        </TrpcProvider>
      </WagmiProvider>
    </StoreProvider>
  )
}

export default MyApp
