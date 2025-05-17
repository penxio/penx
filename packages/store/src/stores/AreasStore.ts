import { get, set } from 'idb-keyval'
import { atom } from 'jotai'
import { ACTIVE_SITE, CreateAreaInput, WidgetType } from '@penx/constants'
import { AreaType } from '@penx/db/client'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { localDB } from '@penx/local-db'
import {
  IAreaNode,
  IChange,
  ISiteNode,
  NodeType,
  OperationType,
} from '@penx/model-type'
import { Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

export const areasAtom = atom<IAreaNode[]>([])

export class AreasStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(areasAtom)
  }

  set(state: IAreaNode[]) {
    this.store.set(areasAtom, state)
  }

  async refetchAreas() {
    const site = this.store.site.get()
    const areas = await localDB.listAreas(site.id)
    this.set(areas)
    return areas
  }

  async addArea(input: CreateAreaInput) {
    const site = this.store.site.get()
    const id = uniqueId()
    const structs = await localDB.listStructs(site.id)
    const area: IAreaNode = {
      id,
      type: NodeType.AREA,
      props: {
        cover: '',
        widgets: getInitialWidgets(structs),
        // type: AreaType.SUBJECT,
        favorites: [],
        isGenesis: false,
        slug: uniqueId(),
        ...input,
      } as IAreaNode['props'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: site.userId,
      siteId: site.id,
    }

    await localDB.addArea(area)
    this.refetchAreas()
    return area
  }

  async deleteArea(area: IAreaNode) {
    await localDB.transaction('rw', localDB.node, localDB.change, async () => {
      if (area.props.isGenesis) {
        throw new Error('Cannot delete last area')
      }

      const creations = await localDB.listCreationsByArea(area.id)
      const creationIds = creations.map((c) => c.id)

      const creationTags = await localDB.listCreationTagsByArea(area.id)
      const creationTagsIds = creationTags.map((c) => c.id)

      await localDB.node.where('id').anyOf(creationTagsIds).delete()
      await localDB.node.where('id').anyOf(creationIds).delete()
      await localDB.node.delete(area.id)

      const site = (await get(ACTIVE_SITE)) as ISiteNode
      if (site.props.isRemote) {
        await localDB.change.add({
          operation: OperationType.DELETE,
          siteId: site.id,
          synced: 0,
          createdAt: new Date(),
          key: area.id,
          data: { id: area.id },
        } as IChange)
      }
    })
    const areas = await this.refetchAreas()
    return areas
  }
}
