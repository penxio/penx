import { format } from 'date-fns'
import { atom } from 'jotai'
import { db } from '@penx/pg'
import { IJournalNode, NodeType } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

export const journalAtom = atom<IJournalNode>(null as unknown as IJournalNode)

export class JournalStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(journalAtom)
  }

  set(state: IJournalNode) {
    this.store.set(journalAtom, state)
  }

  async persistJournal(id: string, input: Partial<IJournalNode['props']>) {
    await db.updateJournalProps(id, input)
  }

  async selectDay(date: Date = new Date()) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const area = this.store.area.get()
    const journals = await db.listJournals(area.id)

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
      await db.addJournal(journal)
      this.set(journal)
    }
  }

  async addJournal(journal: IJournalNode) {
    this.set(journal)
    //
  }
}
