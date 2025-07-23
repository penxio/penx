import { Atom, WritableAtom } from 'jotai'
import { AppStore } from './stores/AppStore'
import { AreasStore } from './stores/AreasStore'
import { AreaStore } from './stores/AreaStore'
import { CreationsStore } from './stores/CreationsStore'
import { CreationTagsStore } from './stores/CreationTagsStore'
import { JournalsStore } from './stores/JournalsStore'
import { PanelsStore } from './stores/PanelsStore'
import { SpaceStore } from './stores/SpaceStore'
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
  space: SpaceStore
  panels: PanelsStore
  structs: StructsStore
  tags: TagsStore
  creationTags: CreationTagsStore
  area: AreaStore
  areas: AreasStore
  creations: CreationsStore
  journals: JournalsStore
}
