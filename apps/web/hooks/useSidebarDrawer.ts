import { atom, useAtom } from 'jotai'

const sidebarDrawerAtom = atom(false)

export function useSidebarDrawer() {
  const [isOpen, setIsOpen] = useAtom(sidebarDrawerAtom)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
