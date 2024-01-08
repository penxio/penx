import { useAtomValue } from 'jotai'
import { ExtensionStore } from '@penx/service'
import { extensionStoreAtom } from '@penx/store'

export function useExtensionStore() {
  const store = useAtomValue(extensionStoreAtom)
  const extensionStore = ExtensionStore.getInstance(store)

  return { extensionStore }
}
