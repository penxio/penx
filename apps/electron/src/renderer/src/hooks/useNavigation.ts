import { JSX, ReactNode } from 'react'
import { atom, useAtom } from 'jotai'
import { store } from '@penx/store'

type Navigation = {
  showHeader?: boolean
  path:
    | '/root'
    | '/extension'
    | '/struct-creations'
    | '/edit-creation'
    | '/edit-struct'
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
  const [navigations, setNavigations] = useAtom(navigationAtom)

  const current = navigations[navigations.length - 1]!
  return {
    navigations,
    current,
    isRoot: current?.path === '/root',
    setNavigations,
    push(nav: Navigation) {
      setNavigations([...navigations, nav])
    },
    pop() {
      setNavigations(navigations.slice(0, -1))
    },
  }
}

export const navigation = {
  getNavigations() {
    return store.get(navigationAtom)
  },
  pop() {
    const navigations = this.getNavigations()
    store.set(navigationAtom, navigations.slice(0, -1))
  },
}
