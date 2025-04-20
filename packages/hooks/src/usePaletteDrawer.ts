import { atom, useAtom } from 'jotai'

const paletteDrawerAtom = atom(false)

export function usePaletteDrawer() {
  const [isOpen, setIsOpen] = useAtom(paletteDrawerAtom)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
