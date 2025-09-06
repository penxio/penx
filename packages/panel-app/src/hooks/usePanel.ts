import { atom, useAtom } from 'jotai'

export type PanelState = {
  location: 'normal' | 'sidepanel' | 'iframe'
  defaultTheme: 'system' | 'light' | 'dark'
}

export const panelAtom = atom<PanelState>({
  location: 'normal',
  defaultTheme: 'system',
})

export function usePanel() {
  const [panel, setPanel] = useAtom(panelAtom)
  return {
    panel,
    isSidepanel: panel.location === 'sidepanel',
    setPanel,
  }
}
