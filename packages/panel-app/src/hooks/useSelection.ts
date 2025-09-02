import { atom, useAtom } from 'jotai'
import { store } from '@penx/store'

export interface Selection {
  text?: string
  process?: ProcessInfo
}

export interface ProcessInfo {
  pid?: number
  name?: string
  bundleIdentifier?: string
}

export const selectionAtom = atom<Selection>(null as any as Selection)

export function useSelection() {
  const [selection, setSelection] = useAtom(selectionAtom)
  return { selection, setSelection }
}

export function getSelection() {
  return store.get(selectionAtom)
}

export function setSelection(selection: Selection) {
  store.set(selectionAtom, selection)
}
