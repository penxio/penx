import { set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { ITag } from '@penx/model-type'
import { api } from '@penx/trpc-client'
import { StoreType } from '../store-types'

export const tagsAtom = atom<ITag[]>([])

export class TagsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(tagsAtom)
  }

  set(state: ITag[]) {
    this.store.set(tagsAtom, state)
  }

  async refetchTags() {
    const site = this.store.site.get()
    const tags = await localDB.tag.where({ siteId: site.id }).toArray()
    this.set(tags)
  }

  async deleteTag(tag: ITag) {
    await localDB.creationTag.where({ tagId: tag.id }).delete()
    await localDB.tag.delete(tag.id)
    await this.refetchTags()
    api.tag.deleteTag.mutate({
      tagId: tag.id,
    })
  }
}
