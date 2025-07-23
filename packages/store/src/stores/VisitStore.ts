import { get, set } from 'idb-keyval'
import { atom } from 'jotai'
import { StoreType } from '../store-types'

export const VISIT = 'VISIT'

export type VisitState = {
  activeAreaId: string
}

export const visitAtom = atom<VisitState>({
  activeAreaId: '',
} as VisitState)

export class VisitStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(visitAtom)
  }

  set(state: VisitState) {
    this.store.set(visitAtom, state)
  }

  async fetch() {
    const space = await this.store.space.fetch()
    const visit = await get(`${VISIT}_${space.id}`)
    return (visit || {}) as VisitState
  }

  async save(data: Partial<VisitState>) {
    const site = await this.store.space.fetch()
    const visit = this.fetch()
    const newVisit = { ...visit, ...data }
    await set(`${VISIT}_${site.id}`, newVisit)
    return newVisit
  }
  async setAndSave(data: Partial<VisitState>) {
    const visit = this.get()
    const newArea = { ...visit, ...data }
    this.set(newArea)
    this.save(data)
    return newArea
  }
}
