import { atom, useAtom } from 'jotai'

const quickAddAtom = atom(false)
const colorNameAtom = atom('#ffffff')

export function useQuickAdd() {
  const [isOpen, setIsOpen] = useAtom(quickAddAtom)
  const [colorName, setColorName] = useAtom(colorNameAtom)
  return {
    isOpen,
    setIsOpen,
    colorName,
    setColorName,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
