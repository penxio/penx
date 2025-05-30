import { atom } from 'jotai'
import { ITagNode } from '@penx/model-type'
import { db } from '@penx/pg'
import { StoreType } from '../store-types'

export const tagsAtom = atom<ITagNode[]>([])

export class TagsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(tagsAtom)
  }

  set(state: ITagNode[]) {
    this.store.set(tagsAtom, state)
  }

  async refetchTags() {
    const area = this.store.area.get()
    const tags = await db.listTags(area.id)
    this.set(tags)
  }

  async deleteTag(tag: ITagNode) {
    const creationTags = await db.listCreationTags(tag.areaId!)

    const ids = creationTags
      .filter((ct) => ct.props.tagId === tag.id)
      .map((ct) => ct.id)

    await db.deleteNodeByIds(ids)
    await db.deleteNode(tag.id)
    await this.refetchTags()
  }
}
