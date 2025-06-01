import { IAreaNode, IJournalNode, NodeType } from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { useJournals } from './useJournals'
import { usePanels } from './usePanels'

function getQueryKey() {
  return ['journal']
}

export function useJournal() {
  const { journalPanel } = usePanels()
  const { journals } = useJournals()
  const journal = journals.find((n) => n.props.date === journalPanel.date)

  return { journal: journal! }
}

export function getJournal() {
  return queryClient.getQueryData(getQueryKey()) as IJournalNode
}

export function updateJournal(journal: IJournalNode) {
  queryClient.setQueryData(getQueryKey(), journal)
}
