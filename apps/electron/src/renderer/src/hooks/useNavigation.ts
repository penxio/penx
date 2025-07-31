import { JSX, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { atom, useAtom } from 'jotai'
import { store } from '@penx/store'
import { searchAtom } from './useSearch'

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
    replace(nav: Navigation) {
      setNavigation(
        produce(navigation, (draft) => {
          navigation[navigation.length - 1] = nav
        }),
      )
    },
    pop() {
      if (navigation.length === 1) {
        setNavigation([
          {
            showHeader: true,
            path: '/root',
          },
        ])
        return
      }
      setNavigation(navigation.slice(0, -1))
    },
    reset() {
      setNavigation([
        {
          showHeader: true,
          path: '/root',
        },
      ])
      store.set(searchAtom, '')
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

  replace(nav: Navigation) {
    const navigation = store.get(navigationAtom)
    store.set(
      navigationAtom,
      produce(navigation, (draft) => {
        navigation[navigation.length - 1] = nav
      }),
    )
  },

  pop() {
    const navigationList = store.get(navigationAtom)
    store.set(navigationAtom, navigationList.slice(0, -1))
  },
}

export function useQueryNavigations() {
  const { data = [], ...rest } = useQuery({
    queryKey: ['navigation'],
    queryFn: () => {
      if (Array.isArray(window.navigations)) {
        return window.navigations as Navigation[]
      }
      const navigations: Navigation[] = [
        {
          showHeader: true,
          path: '/root',
        },
      ]
      window.navigations = navigations
      return navigations
    },
  })
  return {
    data,
    navigations: data,
    current: data[data.length - 1]!,
    ...rest,
  }
}
