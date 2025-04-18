import { createContext, ReactNode, useContext } from 'react'

export interface MenuContext {
  colorScheme?: any
}

export const menuContext = createContext<MenuContext>({} as MenuContext)

export const MenuProvider = menuContext.Provider

export function useMenuContext() {
  return useContext(menuContext)
}
