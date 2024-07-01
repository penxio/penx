import { getCurrent } from '@tauri-apps/api/webviewWindow'
import { register, unregister } from '@tauri-apps/plugin-global-shortcut'
import { get, set } from 'idb-keyval'
import { APP_HOTKEY, appDefaultHotkey } from './constants'

export async function saveAppHotkey(hotkey: string[]) {
  await set(APP_HOTKEY, hotkey)
}

export async function getAppHotkey(): Promise<string[]> {
  const key = await get(APP_HOTKEY)
  if (!key) return appDefaultHotkey
  return key
}

export async function unregisterHotkey(hotkey: string) {
  try {
    await unregister(hotkey)
  } catch (error) {
    console.error(error)
  }
}

export function convertKeysToHotkey(keys: string[]) {
  return keys
    .map((k) => {
      if (k === 'Meta') return 'Command'
      return k
    })
    .join('+')
}

export async function registerAppHotkey(hotkey: string) {
  const appWindow = getCurrent()
  await unregister(hotkey)

  await register(hotkey, async (event) => {
    if (event.state === 'Pressed') {
      await appWindow?.show()
      // await appWindow?.center()
      await appWindow?.setFocus()

      setTimeout(() => {
        const $input =
          document.getElementById('searchBarInput') || document.querySelector('.searchBarInput')

        $input?.focus()
      }, 0)
    }
  })
}

export async function registerDefaultAppHotkey() {
  const keys = await getAppHotkey()

  const hotkey = convertKeysToHotkey(keys || appDefaultHotkey)
  await registerAppHotkey(hotkey)
}
