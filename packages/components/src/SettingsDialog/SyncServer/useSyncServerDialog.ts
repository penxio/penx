import { atom, useAtom } from 'jotai'
import { ISettingsNode } from '@penx/model-type'
import { SessionData } from '@penx/types'

type State = {
  open: boolean
  syncServer: SessionData['syncServer']
}

const syncServerDialogAtom = atom<State>({
  open: false,
  syncServer: undefined as any,
} as State)

export function useSyncServerDialog() {
  const [state, setState] = useAtom(syncServerDialogAtom)
  return {
    ...state,
    setOpen: (open: boolean) => setState({ ...state, open }),
    setState,
  }
}
