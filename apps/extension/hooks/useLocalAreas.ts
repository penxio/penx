import { BACKGROUND_EVENTS } from '@/lib/constants'
import { AREAS_KEY } from '@/lib/helper'
import { useStorage } from '@plasmohq/storage/hook'
import { useQuery } from '@tanstack/react-query'

export function useLocalAreas() {
  return useQuery({
    queryKey: ['localAreas'],
    queryFn: async () => {
      const data = await chrome.runtime.sendMessage({
        type: BACKGROUND_EVENTS.QUERY_AREAS,
      })
      console.log('========>>>data:', data)

      return data?.areas as any[]
    },
  })
}
