import { JSX, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { atom, useAtom } from 'jotai'
import { queryClient } from '@penx/query-client'

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

const queryKey = ['navigation']
function getNavigations() {
  return (queryClient.getQueryData(queryKey) as Navigation[]) || []
}

export function setNavigations(list: Navigation[]) {
  queryClient.setQueryData(queryKey, list)
  window.navigations = list
}

export const navigation = {
  getNavigations() {
    return getNavigations()
  },

  push(nav: Navigation) {
    const navigations = getNavigations()
    const newNav = produce(navigations, (draft) => {
      draft.push(nav)
    })
    console.log('push==newNav:', newNav)

    setNavigations(newNav)
  },

  replace(nav: Navigation) {
    const navigations = getNavigations()
    setNavigations(
      produce(navigations, (draft) => {
        draft[draft.length - 1] = nav
      }),
    )
  },

  pop() {
    const navigations = getNavigations()
    const navNav = produce(navigations, (draft) => {
      draft.pop()
    })

    console.log('pop=====navNav:', navNav)

    setNavigations(navNav)
  },

  reset() {
    setNavigations([
      {
        showHeader: true,
        path: '/root',
      },
    ])
  },
}

export function useQueryNavigations() {
  const { data = [], ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('query.....xxxxxxx:', window.navigations)
      if (Array.isArray(window.navigations) && window.navigations.length) {
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
    isRoot: data.length === 1,
    ...rest,
  }
}
