import { produce } from 'immer'
import { atom } from 'jotai'
import { WidgetType } from '@penx/constants'
import { AreaType } from '@penx/db/client'
import { localDB } from '@penx/local-db'
import { IArea } from '@penx/model-type'
import { api } from '@penx/trpc-client'
import { Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

const getInitialWidgets = () => {
  const widgets: Widget[] = [
    {
      id: uniqueId(),
      type: WidgetType.ALL_CREATIONS,
    },
    {
      id: uniqueId(),
      type: WidgetType.FAVORITES,
    },
    {
      id: uniqueId(),
      type: WidgetType.RECENTLY_EDITED,
    },
  ]
  return widgets
}

export const areasAtom = atom<IArea[]>([])

export class AreasStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(areasAtom)
  }

  set(state: IArea[]) {
    this.store.set(areasAtom, state)
  }

  async refetchAreas() {
    const site = this.store.site.get()
    const list = await localDB.area.where({ siteId: site.id }).toArray()
    this.set(list)
    return list
  }

  async addArea(input: any) {
    const site = this.store.site.get()
    const id = uniqueId()
    const area = {
      ...input,
      id,
      cover: '',
      widgets: getInitialWidgets(),
      type: AreaType.SUBJECT,
      props: {},
      favorites: [],
      isGenesis: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: site.userId,
      siteId: site.id,
    } as IArea

    await localDB.area.add(area)
    this.refetchAreas()
    api.area.createArea.mutate({ id, ...input })
    return area
  }

  async deleteArea(area: IArea) {
    await localDB.area.delete(area.id)
    const areas = await this.refetchAreas()
    api.area.deleteArea.mutate({
      id: area.id,
    })
    return areas
  }
}
