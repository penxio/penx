import { format } from 'date-fns'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IJournalNode, NodeType } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

export const journalsAtom = atom<IJournalNode[]>([] as IJournalNode[])

export class JournalsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(journalsAtom)
  }

  set(state: IJournalNode[]) {
    this.store.set(journalsAtom, state)
  }

  async persistJournal(id: string, input: Partial<IJournalNode['props']>) {
    await localDB.updateJournalProps(id, input)
  }

  async selectDay(date: Date = new Date()) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const area = this.store.area.get()
    const journals = await localDB.listJournals(area.id)

    let dateNode = journals.find(
      (n) => n.type === NodeType.JOURNAL && n.props.date === dateStr,
    )

    if (!dateNode) {
      const journal: IJournalNode = {
        id: uniqueId(),
        type: NodeType.JOURNAL,
        props: {
          date: dateStr,
          children: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        siteId: area.siteId,
        userId: area.userId,
        areaId: area.id,
      }
      await localDB.addJournal(journal)
      // this.set(journal)
    }
  }

  async addJournal(journal: IJournalNode) {
    // this.set(journal)
  }

  async refetchJournals(areaId?: string) {
    const area = this.store.area.get()
    const journals = await localDB.listJournals(areaId || area.id)
    this.set(journals)
    return journals
  }
}
