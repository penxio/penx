import { isMacOs } from 'react-device-detect'
import { useQuery } from '@tanstack/react-query'
import { Shortcut, ShortcutType } from '@penx/types'
import { SHORTCUT_LIST } from '../constants'
import { getShortcutList, saveShortcutList } from '../utils'

export function useShortcuts() {
  return useQuery({
    queryKey: [SHORTCUT_LIST],
    queryFn: async () => {
      const list = await getShortcutList()
      const some = list.some((i) => i.type === ShortcutType.TOGGLE_MAIN_WINDOW)
      if (some) {
        return list
      } else {
        const initialList: Shortcut[] = []
        await saveShortcutList(initialList)
        return initialList
      }
    },
  })
}
