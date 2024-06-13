import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core'
import { BaseDirectory, readDir } from '@tauri-apps/plugin-fs'
import { atom, useAtom, useSetAtom } from 'jotai'
import {
  getAllApps,
  refreshApplicationsList,
} from 'tauri-plugin-jarvis-api/commands'
import { AppInfo } from 'tauri-plugin-jarvis-api/models'
import { appEmitter } from '@penx/event'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { ICommandItem } from '~/common/types'
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
    developingItems: items.filter(isDeveloping).filter((item) => {
      if (!search) return true
      if (item.data?.alias) {
        if (item.data?.alias.toLowerCase().includes(search.toLowerCase())) {
          return true
        }
      }
      return item.title.toString().toLowerCase().includes(search.toLowerCase())
    }),

    commandItems: items
      .filter((item) => isProduction(item) && item.data?.type == 'Command')
      .filter((item) => {
        if (!search) return true
        if (item.data?.alias) {
          if (item.data?.alias.toLowerCase().includes(search.toLowerCase())) {
            return true
          }
        }
        return item.title
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      }),

    databaseItems: items
      .filter((item) => item.data?.type == 'Database')
      .filter((item) => {
        if (!search) return true
        if (item.data?.alias) {
          if (item.data?.alias.toLowerCase().includes(search.toLowerCase())) {
            return true
          }
        }
        return item.title
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      }),

    applicationItems: items
      .filter((item) => item.data?.type == 'Application')
      .filter((item) => {
        if (!search) return true
        if (item.data?.alias) {
          if (item.data?.alias.toLowerCase().includes(search.toLowerCase())) {
            return true
          }
        }
        return item.title
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      }),

    setItems,
  }
}

export const commandsAtom = atom<ICommandItem[]>([])

export function useCommands() {
  const [commands, setCommands] = useAtom(itemsAtom)
  return { commands, setCommands }
}

export function useLoadCommands() {
  return useQuery(['commands'], async () => {
    try {
      await refreshApplicationsList()
      // const [extensions, databases, applicationsRes, entries] =
      const [extensions, databases, applicationsRes, allApps] =
        await Promise.all([
          db.listExtensions(),
          db.listDatabases(),
          invoke('handle_input', {
            input: '',
          }) as Promise<any[]>,
          getAllApps(),
          // readDir('appIcons', {
          //   baseDir: BaseDirectory.AppData,
          //   // recursive: true,
          // }),
        ])
      // console.log('applicationsRes', applicationsRes)
      // console.log('allApps', allApps)

      const commands = extensions.reduce((acc, cur) => {
        return [
          ...acc,
          ...cur.commands.map<ICommandItem>((item) => {
            function getIcon() {
              const defaultIcon = cur.icon ? cur.assets?.[cur.icon] : ''
              if (!item.icon) return defaultIcon

              if (item.icon?.startsWith('/')) return item.icon

              const commandIcon = cur.assets?.[item.icon]
              return commandIcon || defaultIcon
            }

            return {
              type: 'list-item',
              title: item.title,
              subtitle: cur.name,
              icon: getIcon(),
              keywords: [],
              data: {
                type: 'Command',
                alias: item.alias,
                assets: cur.assets,
                filters: item.filters,
                runtime: item.runtime,
                commandName: item.name,
                extensionSlug: cur.name,
                extensionIcon: cur.assets?.[cur.icon as string],
                isDeveloping: cur.isDeveloping,
              } as ICommandItem['data'],
            } as ICommandItem
          }),
        ]
      }, [] as ICommandItem[])

      const databaseItems = databases.reduce((acc, item) => {
        const node = new Node(item)
        if (node.isSpecialDatabase) return acc
        return [
          ...acc,
          {
            type: 'list-item',
            title: node.tagName,
            subtitle: '',
            icon: {
              value: '#',
              bg: node.tagColor,
            },
            keywords: [],
            data: {
              alias: item.props.commandAlias,
              type: 'Database',
              database: item,
            } as ICommandItem['data'],
          } as ICommandItem,
        ]
      }, [] as ICommandItem[])

      // const applicationPaths = (applicationsRes[0] as string[]) || []

      // const applicationItems = allApps.reduce((acc, item) => {
      //   const appName = getFileName(item).replace(/.app$/, '')

      //   return [
      //     ...acc,
      //     {
      //       type: 'list-item',
      //       title: acc,
      //       subtitle: '',
      //       icon: appName,
      //       keywords: [],
      //       data: {
      //         type: 'Application',
      //         applicationPath: acc.app_desktop_path,
      //         isApplication: true,
      //         appIconPath: acc.icon_path,
      //       } as ICommandItem['data'],
      //     } as ICommandItem,
      //   ]
      // }, [] as ICommandItem[])
      const applicationItems = allApps.map((appInfo: AppInfo) => {
        return {
          type: 'list-item',
          title: appInfo.name,
          subtitle: '',
          icon: appInfo.icon_path,
          keywords: [],
          data: {
            type: 'Application',
            applicationPath: appInfo.app_desktop_path,
            isApplication: true,
          } as ICommandItem['data'],
        } as ICommandItem
      })
      return [...commands, ...databaseItems, ...applicationItems]
      // return [...commands, ...databaseItems]
    } catch (error) {
      console.log('==============error:', error)

      return []
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
