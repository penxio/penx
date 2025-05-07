'use client'

import { createContext, PropsWithChildren, useContext } from 'react'

interface Props {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>
  isAll?: boolean
}

export const IsAllContext = createContext({} as Props)

export const IsAllProvider = ({
  isAll = false,
  setVisible,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <IsAllContext.Provider
      value={{
        isAll,
        setVisible,
      }}
    >
      {children}
    </IsAllContext.Provider>
  )
}

export function useIsAllContext() {
  return useContext(IsAllContext)
}
