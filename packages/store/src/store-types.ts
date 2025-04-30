import { Atom, WritableAtom } from 'jotai'
import { MoldsStore } from './stores/moldsStore'
import { PanelsStore } from './stores/PanelsStore'
import { RouterStore } from './stores/RouterStore'
import { SiteStore } from './stores/SiteStore'
import { TagsStore } from './stores/tagsStore'

export type StoreType = {
  get: <Value>(atom: Atom<Value>) => Value
  set: <Value_1, Args extends unknown[], Result>(
    atom: WritableAtom<Value_1, Args, Result>,
    ...args: Args
  ) => Result

  router: RouterStore
  site: SiteStore
  panels: PanelsStore
  molds: MoldsStore
  tags: TagsStore
}
