import { createContext, PropsWithChildren, useContext } from 'react'

type ContextType = {
  open: boolean
  setOpen: (isOpen: boolean) => void
}

export const DrawerContext = createContext({} as ContextType)

export const DrawerProvider = ({
  children,
  ...rest
}: PropsWithChildren<ContextType>) => {
  return (
    <DrawerContext.Provider value={rest}>{children}</DrawerContext.Provider>
  )
}

export function useDrawerContext() {
  return useContext(DrawerContext)
}
