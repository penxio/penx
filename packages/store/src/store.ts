'use client'

import { atom, createStore } from 'jotai'
import { AppStore } from './stores/AppStore'
import { CreationTagsStore } from './stores/creationTagsStore'
import { MoldsStore } from './stores/moldsStore'
import { PanelsStore } from './stores/PanelsStore'
import { RouterStore } from './stores/RouterStore'
import { SiteStore } from './stores/SiteStore'
import { TagsStore } from './stores/tagsStore'

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  get: baseStore.get,
  set: baseStore.set,

  get app() {
    return new AppStore(this)
  },

  get router(): RouterStore {
    return new RouterStore(this)
  },

  get site(): SiteStore {
    return new SiteStore(this)
  },

  get panels(): PanelsStore {
    return new PanelsStore(this)
  },

  get molds(): MoldsStore {
    return new MoldsStore(this)
  },

  get tags(): TagsStore {
    return new TagsStore(this)
  },

  get creationTags(): CreationTagsStore {
    return new CreationTagsStore(this)
  },
})
