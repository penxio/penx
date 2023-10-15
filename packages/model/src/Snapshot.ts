import CryptoJS from 'crypto-js'
import { IDoc, ISpace } from '@penx/types'

export interface SnapshotDiffResult {
  isEqual: boolean
  added: string[]
  deleted: string[]
  updated: string[]
}

export class Snapshot {
  timestamp: number

  // Record<docId, md5>
  map: Record<string, string> = {}

  constructor(public space: ISpace) {
    this.timestamp = space.snapshot?.timestamp || Date.now()
    this.map = space.snapshot?.hashMap || {}
  }

  md5Doc = (doc: IDoc) => {
    const data = {
      status: doc.status,
      title: doc.title,
      content: doc.content,
    }
    return CryptoJS.MD5(JSON.stringify(data)).toString()
  }

  private updateTimestamp = () => {
    this.timestamp = Date.now()
  }

  add = (docId: string, doc: IDoc) => {
    this.updateTimestamp()
    this.map[docId] = this.md5Doc(doc)
  }

  update = (docId: string, doc: IDoc) => {
    this.updateTimestamp()
    this.map[docId] = this.md5Doc(doc)
  }

  delete = (docId: string) => {
    this.updateTimestamp()
    delete this.map[docId]
  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      hashMap: this.map,
    }
  }

  diff(serverSnapshot: ISpace['snapshot']): SnapshotDiffResult {
    const { map: localMap } = this
    const { hashMap: serverMap } = serverSnapshot
    console.log('serverSnapshot:', serverSnapshot, 's:', this.toJSON())

    const localIds = Object.keys(localMap)
    const serverIds = Object.keys(serverMap)

    const added = localIds.filter((item) => !serverIds.includes(item))
    const same = localIds.filter((item) => serverIds.includes(item))
    const deleted = serverIds.filter((item) => !localIds.includes(item))
    const updated: string[] = []

    for (const id of same) {
      if (localMap[id] !== serverMap[id]) {
        updated.push(id)
      }
    }

    const isEqual =
      added.length === 0 && updated.length === 0 && deleted.length === 0

    return {
      isEqual,
      added,
      deleted,
      updated,
    }
  }
}
