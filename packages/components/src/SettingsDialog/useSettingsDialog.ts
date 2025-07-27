import { atom, useAtom } from 'jotai'

export enum SettingsNav {
  APPEARANCE = 'APPEARANCE',
  PROFILE = 'PROFILE',
  PASSWORD = 'PASSWORD',
  BILLING = 'BILLING',
  RECOVER_PHRASE = 'RECOVER_PHRASE',
  SYNC_SERVER = 'SYNC_SERVER',
  EDIT_SHORTCUTS = 'EDIT_SHORTCUTS',
  ABOUT = 'ABOUT',
}

type State = {
  open: boolean
  navName: string
}

const settingsAtom = atom<State>({
  open: false,
  navName: SettingsNav.APPEARANCE,
} as State)

export function useSettingsDialog() {
  const [state, setState] = useAtom(settingsAtom)
  return {
    ...state,
    setOpen: (open: boolean) => setState({ ...state, open }),
    setNavName: (name: string) => setState({ ...state, navName: name }),
    setState,
  }
}
