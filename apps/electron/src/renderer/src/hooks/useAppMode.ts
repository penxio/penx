import { atom, useAtom } from 'jotai'

type Mode = 'COMMAND' | 'EDITOR'

export const appModeAtom = atom<Mode>('COMMAND')

export function useAppMode() {
  const [mode, setMode] = useAtom(appModeAtom)

  return {
    isEditor: mode === 'EDITOR',
    mode,
    setMode,
  }
}
