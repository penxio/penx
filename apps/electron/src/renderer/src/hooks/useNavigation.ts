import { JSX, ReactNode } from 'react'
import { atom, useAtom } from 'jotai'
import { store } from '@penx/store'

type Navigation = {
  showHeader?: boolean
  path:
    | '/root'
    | '/login'
    | '/extension'
    | '/struct-creations'
    | '/edit-creation'
    | '/edit-struct'
    | '/configure-shortcut'
    | '/quick-input'
  component?: (() => ReactNode) | (() => JSX.Element)
  data?: Record<string, any>
}

export const navigationAtom = atom<Navigation[]>([
  {
    showHeader: true,
    path: '/root',
  },
] as Navigation[])

export function useNavigation() {
  const [navigation, setNavigation] = useAtom(navigationAtom)

  const current = navigation[navigation.length - 1]!
  return {
    navigation,
    current,
    isRoot: current?.path === '/root',
    setNavigation,
    push(nav: Navigation) {
      setNavigation([...navigation, nav])
    },
    pop() {
      setNavigation(navigation.slice(0, -1))
    },
  }
}

export const navigation = {
  getNavigation() {
    return store.get(navigationAtom)
  },

  push(nav: Navigation) {
    const navigationList = store.get(navigationAtom)
    store.set(navigationAtom, [...navigationList, nav])
  },

  pop() {
    const navigationList = store.get(navigationAtom)
    store.set(navigationAtom, navigationList.slice(0, -1))
  },
}
