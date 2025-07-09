import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useSetAtom } from 'jotai'
import { appEmitter } from '@penx/emitter'
import { useSearch } from './useSearch'
import { ICommandItem } from '~/lib/types'
import { store } from '@penx/store'
import { Struct } from '@penx/domain'

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
    commandItems: items,
    databaseItems: [],
    applicationItems: items,
    setItems
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
          keywords: [struct.name],
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
            isApplication: false
          }
        }
      })

      return [...structCommands] as ICommandItem[]
    }
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
    if (data?.length) {
      setItems(data)
      setCommands(data)
    }
  }, [data, setItems, setCommands])
}
