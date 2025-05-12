import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { ITagNode } from '@penx/model-type'
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
    const site = this.store.site.get()
    const tags = await localDB.listTags(site.id)
    this.set(tags)
  }

  async deleteTag(tag: ITagNode) {
    const creationTags = await localDB.listCreationTags(tag.siteId)

    const ids = creationTags
      .filter((ct) => ct.props.tagId === tag.id)
      .map((ct) => ct.id)

    await localDB.node.where('id').anyOf(ids).delete()
    await localDB.node.delete(tag.id)
    await this.refetchTags()
  }
}
