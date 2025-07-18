import { useEffect } from 'react'
import { t } from '@lingui/core/macro'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useSetAtom } from 'jotai'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { ICommandItem } from '~/lib/types'
import { useSearch } from './useSearch'

const isDeveloping = (item: ICommandItem) => item.data?.isDeveloping
const isProduction = (item: ICommandItem) => !item.data?.isDeveloping

const getFileName = (path: string) => {
  return path.split('/').pop() as string
}

export const itemsAtom = atom<ICommandItem[]>([])

export function useItems() {
  const { search } = useSearch()
  const [items, setItems] = useAtom(itemsAtom)
  return {
    items,
    developingItems: [],
    commandItems: items.filter((item) => {
      if (!search) return true
      const s = search.toLowerCase()
      if (item.data?.alias) {
        if (item.data?.alias.toLowerCase().includes(s)) {
          return true
        }
      }
      if (item.title.toString().toLowerCase().includes(s)) {
        return true
      }

      return item.keywords.some((k) => k.toLowerCase().includes(s))
    }),
    databaseItems: [],
    applicationItems: items,
    setItems,
  }
}

export const commandsAtom = atom<ICommandItem[]>([])

export function useCommands() {
  const [commands, setCommands] = useAtom(itemsAtom)
  return { commands, setCommands }
}

export function useLoadCommands() {
  return useQuery({
    queryKey: ['commands'],
    queryFn: () => {
      const structs = store.structs.get()

      const structCommands = structs.map<ICommandItem>((item) => {
        const struct = new Struct(item)
        return {
          title: struct.name,
          keywords: [struct.type],
          data: {
            type: 'Struct',
            alias: '',
            struct: struct,
            assets: {},
            filters: {},
            runtime: 'worker',
            commandName: struct.name,
            extensionSlug: '',
            extensionIcon: '',
            isDeveloping: false,
            applicationPath: '',
            isApplication: false,
          },
        }
      })

      const quickInput: ICommandItem = {
        title: t`Quick input`,
        keywords: ['Quick', 'Input', 'Quick input'],
        icon: {
          // name: 'solar:pen-bold',
          name: 'lucide:pen-line',
          className: 'bg-linear-to-r from-cyan-500 to-blue-500',
        },
        data: {
          type: 'Command',
          alias: '',
          assets: {},
          filters: {},
          runtime: 'worker',
          commandName: 'quick_input',
          extensionSlug: '',
          extensionIcon: '',
          isDeveloping: false,
          applicationPath: '',
          isApplication: false,
        },
      }

      return [quickInput, ...structCommands] as ICommandItem[]
    },
  })
}

export function useQueryCommands() {
  const setItems = useSetAtom(itemsAtom)
  const setCommands = useSetAtom(commandsAtom)
  const { data, refetch } = useLoadCommands()

  useEffect(() => {
    appEmitter.on('ON_APPLICATION_DIR_CHANGE', refetch)
    return () => {
      appEmitter.off('ON_APPLICATION_DIR_CHANGE', refetch)
    }
  }, [])

  useEffect(() => {
    appEmitter.on('ON_AREA_SELECTED', refetch)
    return () => {
      appEmitter.off('ON_AREA_SELECTED', refetch)
    }
  }, [])

  useEffect(() => {
    if (data?.length) {
      setItems(data)
      setCommands(data)
    }
  }, [data, setItems, setCommands])
}
