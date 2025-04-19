import { atom, useAtom } from 'jotai'
import { hideThumbnail } from '../stores/thumbnail.store'

const appTypeAtom = atom<string>('')

export function useAppType() {
  const [appType, setAppType] = useAtom(appTypeAtom)
  function destroy() {
    setAppType('')
    hideThumbnail()
  }

  return { appType, setAppType, destroy }
}
