'use client'

import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { commands } from './constants'
import { RouterStore } from './stores/RouterStore'
import { Command } from './types'

export const commandsAtom = atom<Command[]>(commands)

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  get: baseStore.get,
  set: baseStore.set,

  get router(): RouterStore {
    return new RouterStore(this)
  },
})
