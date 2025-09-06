import { atom, useAtom } from 'jotai'

export type PanelState = {
  location: 'normal' | 'sidepanel' | 'iframe'
}

export const panelAtom = atom<PanelState>({
  location: 'normal',
})

export function usePanel() {
  const [panel, setPanel] = useAtom(panelAtom)
  return {
    panel,
    isSidepanel: panel.location === 'sidepanel',
    setPanel,
  }
}
