import { produce } from 'immer'
import { atom } from 'jotai'
import { UpdateAreaInput } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { IAreaNode } from '@penx/model-type'
import { api } from '@penx/trpc-client'
import { Widget } from '@penx/types'
import { StoreType } from '../store-types'

export const areaAtom = atom<IAreaNode>(null as unknown as IAreaNode)

export class AreaStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(areaAtom)
  }

  set(state: IAreaNode) {
    this.store.set(areaAtom, state)
  }

  async persistArea(input: UpdateAreaInput) {
    const { id, ...data } = input
    await localDB.updateAreaProps(id, data)
  }

  async addWidget(widget: Widget) {
    const area = this.get()

    const newArea = produce(area, (draft) => {
      draft.props.widgets.push(widget)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.props.widgets,
    })
  }

  async removeWidget(widgetId: string) {
    const area = this.get()
    const newArea = produce(area, (draft) => {
      draft.props.widgets = draft.props.widgets.filter((w) => w.id !== widgetId)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.props.widgets,
    })
  }

  async toggleCollapsed(widgetId: string) {
    const area = this.get()

    const newArea = produce(area, (draft) => {
      for (const widget of draft.props.widgets) {
        if (widgetId === widget.id) {
          widget.collapsed = !widget.collapsed
        }
      }
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.props.widgets,
    })
  }

  async addToFavorites(creationId: string) {
    const area = this.get()
    const newArea = produce(area, (draft) => {
      if (!Array.isArray(draft.props.favorites)) draft.props.favorites = []
      draft.props.favorites.push(creationId)
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.props.widgets,
    })
  }

  async removeFromFavorites(creationId: string) {
    const area = this.get()
    const newArea = produce(area, (draft) => {
      draft.props.favorites = draft.props.favorites.filter(
        (i) => i !== creationId,
      )
    })

    this.set(newArea)

    await this.persistArea({
      id: area.id,
      widgets: newArea.props.widgets,
    })
  }

  async updateArea(input: UpdateAreaInput) {
    const { id, ...data } = input
    const area = this.get()

    this.set({
      ...area,
      props: {
        ...area.props,
        ...data,
      },
    })
    await this.persistArea(input)
    await this.store.areas.refetchAreas()
  }
}
