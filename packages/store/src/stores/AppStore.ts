import { atom } from 'jotai'
import { StoreType } from '../store-types'

export const appLoadingAtom = atom(true)
export const appErrorAtom = atom('')

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

  getAppError() {
    return this.store.get(appErrorAtom)
  }

  setAppError(error: string) {
    return this.store.set(appErrorAtom, error)
  }
}
