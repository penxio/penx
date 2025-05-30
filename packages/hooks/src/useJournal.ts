import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { produce } from 'immer'
import { db } from '@penx/pg'
import { IAreaNode, IJournalNode, NodeType } from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { store } from '@penx/store'
import { uniqueId } from '@penx/unique-id'

function getQueryKey() {
  return ['journal']
}

async function getOrCreateJournal(date: Date) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const area = store.area.get()
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
    return journal
  }
  return dateNode
}

export function useJournal(date?: string) {
  const { data, ...rest } = useQuery({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const journal = getOrCreateJournal(date ? new Date(date) : new Date())

      return journal
    },
  })
  return { data, ...rest }
}

export function getJournal() {
  return queryClient.getQueryData(getQueryKey()) as IJournalNode
}

export async function addCreationToJournal(creationId: string, date = '') {
  let journal = getJournal()
  if (!journal) {
    journal = await getOrCreateJournal(date ? new Date(date) : new Date())
  }

  const newJournal = produce(journal, (draft) => {
    draft.props.children.unshift(creationId)
  })
  queryClient.setQueryData(getQueryKey(), newJournal)
  db.updateJournalProps(journal.id, {
    children: newJournal.props.children,
  })
}

export async function goToDay(date: Date) {
  const journal = await getOrCreateJournal(date)
  queryClient.setQueryData(getQueryKey(), journal)
  store.panels.updateJournalPanel(format(date, 'yyyy-MM-dd'))
}
