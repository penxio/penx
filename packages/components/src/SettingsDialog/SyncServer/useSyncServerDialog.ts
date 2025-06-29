import { atom, useAtom } from 'jotai'
import { ISettingsNode } from '@penx/model-type'

type State = {
  open: boolean
  syncServer: ISettingsNode['props']['syncServer']
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
