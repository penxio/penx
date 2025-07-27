import { useEffect } from 'react'
import { t } from '@lingui/core/macro'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useSetAtom } from 'jotai'
import { Creation, Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { docToString } from '@penx/utils/editorHelper'
import { PageAIChat } from '~/components/Panel/pages/PageAIChat'
import { PageQuickInput } from '~/components/Panel/pages/PageQuickInput'
import { creationToCommand } from '~/lib/creationToCommand'
import { getBuiltinCommands } from '~/lib/getBuiltinCommands'
import { pinWindow } from '~/lib/pinned'
import { structToCommand } from '~/lib/structToCommand'
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
  const { creations } = useCreations()
  const { area } = useArea()

  const filterCommandBySearch = (item: ICommandItem) => {
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
  }

  const filterCreationBySearch = (item: Creation) => {
    if (!search) return true
    const t = search.toLowerCase()

    if (item.title.toLowerCase().includes(t)) return true
    const contentStr = docToString(item.content)
    if (contentStr.toLowerCase().includes(t)) return true

    if (!item.cells) {
      return false
    }

    const values: string[] = Object.values(item.cells)

    return values.some((v) => {
      if (typeof v === 'string') {
        return v.toLowerCase().includes(t)
      }
      return JSON.stringify(v).toLowerCase().includes(t)
    })
  }

  const isFavor = (item: ICommandItem) => area.favorCommands.includes(item.id)

  return {
    items,
    favorItems: area.favorCommands
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is ICommandItem => !!item && filterCommandBySearch(item)),
    commandItems: items.filter(
      (item) =>
        item.data.type === 'Command' &&
        !isFavor(item) &&
        filterCommandBySearch(item),
    ),
    creationItems: items.filter(
      (item) =>
        item.data.type === 'Creation' &&
        !isFavor(item) &&
        filterCreationBySearch(item.data.creation!),
    ),
    structItems: items.filter(
      (item) =>
        item.data.type === 'Struct' &&
        !isFavor(item) &&
        filterCommandBySearch(item),
    ),
    developingItems: [],
    applicationItems: [],
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
      const creations = store.creations.get()

      const structCommands = structs.map<ICommandItem>((item) => {
        const struct = new Struct(item)
        return structToCommand(struct)
      })

      const builtinCommands = getBuiltinCommands()

      const creationCommands = creations.map((c) =>
        creationToCommand(new Creation(c)),
      )

      return [
        ...structCommands,
        ...builtinCommands,
        ...creationCommands,
      ] as ICommandItem[]
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
