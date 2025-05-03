import { set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { UpdateAreaInput } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { IArea } from '@penx/model-type'
import { api } from '@penx/trpc-client'
import { Widget } from '@penx/types'
import { StoreType } from '../store-types'

export const areaAtom = atom<IArea>(null as unknown as IArea)

export class AreaStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(areaAtom)
  }

  set(state: IArea) {
    this.store.set(areaAtom, state)
  }

  async persistArea(input: UpdateAreaInput) {
    const { id, ...data } = input
    await localDB.area.update(id, data)
  }

  async addWidget(widget: Widget) {
    const area = this.get()

    const newArea = produce(area, (draft) => {
      draft.widgets.push(widget)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.widgets,
    })
  }

  async removeWidget(widgetId: string) {
    const area = this.get()
    const newArea = produce(area, (draft) => {
      draft.widgets = draft.widgets.filter((w) => w.id !== widgetId)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.widgets,
    })
  }

  async toggleCollapsed(widgetId: string) {
    const area = this.get()

    const newArea = produce(area, (draft) => {
      for (const widget of draft.widgets) {
        if (widgetId === widget.id) {
          widget.collapsed = !widget.collapsed
        }
      }
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.widgets,
    })
  }

  async addToFavorites(creationId: string) {
    const area = this.get()
    const newArea = produce(area, (draft) => {
      if (!Array.isArray(draft.favorites)) draft.favorites = []
      draft.favorites.push(creationId)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.widgets,
    })
  }

  async removeFromFavorites(creationId: string) {
    const area = this.get()
    const newArea = produce(area, (draft) => {
      draft.favorites = draft.favorites.filter((i) => i !== creationId)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.widgets,
    })
  }

  async updateArea(input: UpdateAreaInput) {
    const area = this.get()

    this.set({
      ...area,
      ...input,
    })
    await this.persistArea(input)
    await this.store.areas.refetchAreas()
  }
}
