import { atom, useAtom } from 'jotai'

export const openAtom = atom(false)

export function useOpen() {
  const [open, setOpen] = useAtom(openAtom)

  return {
    open,
    setOpen,
    close: () => setOpen(false),
  }
}
