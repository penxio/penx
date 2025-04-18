'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Friend } from '@/lib/theme.types'

export const FriendsContext = createContext({} as Friend[])

interface Props {
  friends: Friend[]
}

export const FriendsProvider = ({
  friends,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <FriendsContext.Provider value={friends}>
      {children}
    </FriendsContext.Provider>
  )
}

export function useFriendsContext() {
  const friends = useContext(FriendsContext)
  return friends
}
