import { atom, useAtom, useAtomValue } from 'jotai'

export const mobileNavAtom = atom<any>({} as any)

export function useMobileNav() {
  const [nav, setNav] = useAtom(mobileNavAtom)
  return {
    routeToHome: () => {
      nav.current?.popToRoot()
    },
    open: () => nav.current?.open(),
    nav,
    setNav,
  }
}
