import { Atom, WritableAtom } from 'jotai'
import { AppStore } from './stores/AppStore'
import { AreasStore } from './stores/AreasStore'
import { AreaStore } from './stores/AreaStore'
import { CreationsStore } from './stores/CreationsStore'
import { CreationTagsStore } from './stores/CreationTagsStore'
import { JournalStore } from './stores/JournalStore'
import { PanelsStore } from './stores/PanelsStore'
import { SiteStore } from './stores/SiteStore'
import { StructsStore } from './stores/StructsStore'
import { TagsStore } from './stores/TagsStore'
import { VisitStore } from './stores/VisitStore'

export type StoreType = {
  get: <Value>(atom: Atom<Value>) => Value
  set: <Value_1, Args extends unknown[], Result>(
    atom: WritableAtom<Value_1, Args, Result>,
    ...args: Args
  ) => Result

  app: AppStore
  visit: VisitStore
  site: SiteStore
  panels: PanelsStore
  structs: StructsStore
  tags: TagsStore
  creationTags: CreationTagsStore
  area: AreaStore
  areas: AreasStore
  creations: CreationsStore
  journal: JournalStore
}
