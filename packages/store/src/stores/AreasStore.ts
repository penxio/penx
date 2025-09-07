import { get, set } from 'idb-keyval'
import { atom } from 'jotai'
import { ACTIVE_SPACE, CreateAreaInput, WidgetType } from '@penx/constants'
import { idb } from '@penx/indexeddb'
import { getDefaultStructs } from '@penx/libs/struct-generator/struct-generator'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { localDB } from '@penx/local-db'
import {
  IAreaNode,
  IChange,
  ISpaceNode,
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
    const site = this.store.space.get()
    const areas = await localDB.listAreas(site.id)
    this.set(areas)
    return areas
  }

  async addArea(input: CreateAreaInput) {
    const site = this.store.space.get()
    const id = uniqueId()
    const area: IAreaNode = {
      id,
      type: NodeType.AREA,
      props: {
        cover: '',
        widgets: [],
        // type: AreaType.SUBJECT,
        favorites: [],
        favorCommands: [],
        isGenesis: false,
        slug: uniqueId(),
        ...input,
      } as IAreaNode['props'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: site.userId,
      spaceId: site.id,
    }

    await localDB.addArea(area)

    const structs = getDefaultStructs({
      areaId: area.id,
      userId: site.userId,
      spaceId: site.id,
    })

    for (const struct of structs) {
      await localDB.addStruct(struct)
    }

    const widgets = getInitialWidgets(structs)
    await localDB.node.update(area.id, {
      props: {
        ...area.props,
        widgets,
      },
    })

    this.store.structs.refetchStructs(area.id)
    this.refetchAreas()
    return area
  }

  async deleteArea(area: IAreaNode) {
    if (area.props.isGenesis) {
      throw new Error('Cannot delete last area')
    }

    const creations = await localDB.listCreationsByArea(area.id)
    const creationIds = creations.map((c) => c.id)

    const creationTags = await localDB.listCreationTagsByArea(area.id)
    const creationTagsIds = creationTags.map((c) => c.id)

    await localDB.node.deleteNodeByIds([...creationTagsIds, ...creationIds])
    await localDB.node.delete(area.id)

    const site = (await get(ACTIVE_SPACE)) as ISpaceNode
    if (site.props.isRemote) {
      await idb.change.add({
        operation: OperationType.DELETE,
        spaceId: site.id,
        synced: 0,
        createdAt: new Date(),
        key: area.id,
        data: { id: area.id },
      } as IChange)
    }

    const areas = await this.refetchAreas()
    return areas
  }
}
