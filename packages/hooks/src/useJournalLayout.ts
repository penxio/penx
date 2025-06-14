import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { queryClient } from '@penx/query-client'

export enum JournalLayout {
  BUBBLE = 'BUBBLE',
  LIST = 'LIST',
  CARD = 'CARD',
  WIDGET = 'WIDGET',
}

const key = 'JOURNAL_LAYOUT'

export function useJournalLayout() {
  const { data, ...rest } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const layout = await get(key)
      return layout || JournalLayout.WIDGET
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  })
  return {
    data,
    layout: data!,
    isCard: data === JournalLayout.CARD,
    isWidget: data === JournalLayout.WIDGET,
    isBubble: data === JournalLayout.BUBBLE,
    isList: data === JournalLayout.LIST,
    ...rest,
  }
}

export async function updateJournalLayout(layout: JournalLayout) {
  await set(key, layout)
  queryClient.setQueryData([key], layout)
}
