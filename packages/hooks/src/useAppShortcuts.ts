import { useAtomValue } from 'jotai'
import { appShortcutAtom } from '@penx/store'

export function useAppShortcuts() {
  const shortcutNode = useAtomValue(appShortcutAtom)

  return {
    shortcuts: shortcutNode.props.shortcuts || [],
  }
}
