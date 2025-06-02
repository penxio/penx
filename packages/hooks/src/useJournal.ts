import { format } from 'date-fns'
import { IAreaNode, IJournalNode, NodeType } from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { useJournals } from './useJournals'
import { usePanels } from './usePanels'

function getQueryKey() {
  return ['journal']
}

export function useJournal() {
  const { journalPanel, panels } = usePanels()
  const { journals } = useJournals()

  // console.log('=====journalPanel:', journalPanel, 'journals:', journals)

  const journal = journals.find((n) => {
    return n.props.date === journalPanel?.date
  })

  // console.log('==========journal>>>>>>>>>>>>>:', journal)

  return { journal: journal! }
}

export function getJournal() {
  return queryClient.getQueryData(getQueryKey()) as IJournalNode
}

export function updateJournal(journal: IJournalNode) {
  queryClient.setQueryData(getQueryKey(), journal)
}
