import { Conf } from 'electron-conf/renderer'
import { produce } from 'immer'
import { Shortcut } from '@penx/model-type'
import { SHORTCUT_LIST } from './constants'

const conf = new Conf()

export async function getShortcutList(): Promise<Shortcut[]> {
  const list = (await conf.get(SHORTCUT_LIST)) as Shortcut[]
  if (!list) return []
  return list
}

export async function saveShortcutList(list: Shortcut[]) {
  await conf.set(SHORTCUT_LIST, list)
}

export async function upsertShortcut(value: Shortcut) {
  const list = await getShortcutList()
  const newList = produce(list, (draft) => {
    const index = draft.findIndex((i) => i.type === value.type)
    if (index) {
      list[index] = value
    } else {
      list.push(value)
    }
  })
  await saveShortcutList(newList)
}

export async function unregisterHotkey(shortcut: Shortcut) {
  try {
    await window.customElectronApi.shortcut.unregister(shortcut)
  } catch (error) {
    console.error('unregister error:', error)
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

export async function registerHotkey(shortcut: Shortcut) {
  await window.customElectronApi.shortcut.unregister(shortcut)
  await window.customElectronApi.shortcut.register(shortcut)
}
