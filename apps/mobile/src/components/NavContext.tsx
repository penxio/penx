'use client'

import { createContext, PropsWithChildren, useContext } from 'react'

export const NavContext = createContext({} as HTMLIonNavElement)

interface Props {
  nav: HTMLIonNavElement
}

export const NavProvider = ({ nav, children }: PropsWithChildren<Props>) => {
  return <NavContext.Provider value={nav}>{children}</NavContext.Provider>
}

export function useNavContext() {
  const nav = useContext(NavContext)
  return nav
}
