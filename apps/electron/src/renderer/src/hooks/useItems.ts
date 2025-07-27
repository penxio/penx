import { useEffect } from 'react'
import { t } from '@lingui/core/macro'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useSetAtom } from 'jotai'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
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

  const filteredItems = items.filter((item) => {
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
  })

  const filteredCreations = creations
    .filter((row) => {
      if (!search) return false
      const t = search.toLowerCase()

      if (row.title.toLowerCase().includes(t)) return true
      const contentStr = docToString(row.content)
      if (contentStr.toLowerCase().includes(t)) return true

      if (!row.cells) {
        return false
      }

      const values: string[] = Object.values(row.cells)

      return values.some((v) => {
        if (typeof v === 'string') {
          return v.toLowerCase().includes(t)
        }
        return JSON.stringify(v).toLowerCase().includes(t)
      })
    })
    .slice(0, 20)

  const creationCommands = filteredCreations.map((c) => creationToCommand(c))

  return {
    items,
    developingItems: [],
    commandItems: [...filteredItems, ...creationCommands],
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
        return structToCommand(struct)
      })

      const aiChat: ICommandItem = {
        id: 'ai-chat',
        title: t`AI Chat`,
        keywords: ['ai', 'chat'],
        icon: {
          // name: 'solar:pen-bold',
          name: 'mingcute:ai-fill',
          className: 'bg-linear-to-r from-red-500 to-orange-500',
        },
        data: {
          type: 'Command',
          component: PageAIChat,
          alias: '',
          assets: {},
          filters: {},
          runtime: 'worker',
          commandName: 'ai-chat',
          extensionSlug: '',
          extensionIcon: '',
          isDeveloping: false,
          applicationPath: '',
          isApplication: false,
        },
      }

      const quickInput: ICommandItem = {
        id: 'quick-input',
        title: t`Quick input`,
        keywords: ['Quick', 'Input', 'Quick input'],
        icon: {
          name: 'lucide:pen-line',
          className: 'bg-linear-to-r from-cyan-500 to-blue-500',
        },
        data: {
          type: 'Command',
          component: PageQuickInput,
          afterOpen() {
            pinWindow()
          },
          alias: '',
          assets: {},
          filters: {},
          runtime: 'worker',
          commandName: 'quick-input',
          extensionSlug: '',
          extensionIcon: '',
          isDeveloping: false,
          applicationPath: '',
          isApplication: false,
        },
      }

      const builtinCommands = getBuiltinCommands()

      return [
        aiChat,
        quickInput,
        ...structCommands,
        ...builtinCommands,
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
