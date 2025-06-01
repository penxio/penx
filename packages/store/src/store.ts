'use client'

import { atom, createStore } from 'jotai'
import { AppStore } from './stores/AppStore'
import { AreasStore } from './stores/AreasStore'
import { AreaStore } from './stores/AreaStore'
import { CreationsStore } from './stores/CreationsStore'
import { CreationTagsStore } from './stores/CreationTagsStore'
import { JournalsStore } from './stores/JournalsStore'
import { PanelsStore } from './stores/PanelsStore'
import { SiteStore } from './stores/SiteStore'
import { StructsStore } from './stores/StructsStore'
import { TagsStore } from './stores/TagsStore'
import { VisitStore } from './stores/VisitStore'

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  get: baseStore.get,
  set: baseStore.set,

  get app(): AppStore {
    return new AppStore(this)
  },

  get visit(): VisitStore {
    return new VisitStore(this)
  },

  get site(): SiteStore {
    return new SiteStore(this)
  },

  get journals(): JournalsStore {
    return new JournalsStore(this)
  },

  get panels(): PanelsStore {
    return new PanelsStore(this)
  },

  get area(): AreaStore {
    return new AreaStore(this)
  },

  get areas(): AreasStore {
    return new AreasStore(this)
  },

  get creations(): CreationsStore {
    return new CreationsStore(this)
  },

  get structs(): StructsStore {
    return new StructsStore(this)
  },

  get tags(): TagsStore {
    return new TagsStore(this)
  },

  get creationTags(): CreationTagsStore {
    return new CreationTagsStore(this)
  },
})
