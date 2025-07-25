import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IShortcutNode, Shortcut } from '@penx/model-type'
import { StoreType } from '../store-types'

export const appLoadingAtom = atom(true)
export const appPasswordNeededAtom = atom(false)
export const appErrorAtom = atom('')
export const appShortcutAtom = atom<IShortcutNode>(null as any as IShortcutNode)

export class AppStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(appLoadingAtom)
  }

  getAppLoading() {
    return this.store.get(appLoadingAtom)
  }

  setAppLoading(loading: boolean) {
    return this.store.set(appLoadingAtom, loading)
  }

  getPasswordNeeded() {
    return this.store.get(appPasswordNeededAtom)
  }

  setPasswordNeeded(need: boolean) {
    return this.store.set(appPasswordNeededAtom, need)
  }

  getShortcut() {
    return this.store.get(appShortcutAtom)
  }

  setShortcut(value: IShortcutNode) {
    return this.store.set(appShortcutAtom, value)
  }

  async upsertShortcut(shortcut: Shortcut) {
    const node = this.getShortcut()
    const newNode = produce(node, (draft) => {
      const index = draft.props.shortcuts.findIndex(
        (s) => s.commandId === shortcut.commandId,
      )
      if (index > -1) {
        draft.props.shortcuts[index] = shortcut
      } else {
        draft.props.shortcuts.push(shortcut)
      }
    })

    await localDB.updateNodeProps(node.id, newNode.props)

    return this.store.set(appShortcutAtom, newNode)
  }

  getAppError() {
    return this.store.get(appErrorAtom)
  }

  setAppError(error: string) {
    return this.store.set(appErrorAtom, error)
  }
}
