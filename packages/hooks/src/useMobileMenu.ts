import { atom, useAtom, useAtomValue } from 'jotai'

export const mobileMenuAtom = atom<any>({} as any)

export function useMobileMenu() {
  const [menu, setMenu] = useAtom(mobileMenuAtom)
  return {
    close: () => {
      return menu.current?.close()
    },
    open: () => menu.current?.open(),
    menu,
    setMenu,
  }
}
