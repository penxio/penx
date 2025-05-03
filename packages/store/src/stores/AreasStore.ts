import { get, set } from 'idb-keyval'
import { atom } from 'jotai'
import { ACTIVE_SITE, WidgetType } from '@penx/constants'
import { AreaType } from '@penx/db/client'
import { localDB } from '@penx/local-db'
import { IArea, IChange, ISite, OperationType } from '@penx/model-type'
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
    return area
  }

  async deleteArea(area: IArea) {
    await localDB.transaction(
      'rw',
      localDB.area,
      localDB.creation,
      localDB.creationTag,
      localDB.change,
      async () => {
        if (area.isGenesis) {
          throw new Error('Cannot delete genesis area')
        }

        const creations = await localDB.creation
          .where({ areaId: area.id })
          .toArray()
        const creationIds = creations.map((c) => c.id)

        await localDB.creationTag
          .where('creationId')
          .anyOf(creationIds)
          .delete()

        await localDB.creation.where({ areaId: area.id }).delete()

        await localDB.area.delete(area.id)

        const site = (await get(ACTIVE_SITE)) as ISite
        if (site.isRemote) {
          await localDB.change.add({
            operation: OperationType.DELETE,
            table: 'area',
            siteId: site.id,
            synced: 0,
            createdAt: new Date(),
            key: area.id,
            data: { id: area.id },
          } as IChange)
        }
      },
    )
    const areas = await this.refetchAreas()
    return areas
  }
}
