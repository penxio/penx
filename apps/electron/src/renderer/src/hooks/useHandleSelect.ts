// import { invoke } from '@tauri-apps/api/core'
import { appEmitter } from '@penx/emitter'
import { useStructs } from '@penx/hooks/useStructs'
import { ICommandItem } from '~/lib/types'
import { useCommandAppLoading } from './useCommandAppLoading'
import { useCommandAppUI } from './useCommandAppUI'
import { CommandOptions, useCommandOptions } from './useCommandOptions'
import { useCurrentCommand } from './useCurrentCommand'
import { useCurrentStruct } from './useCurrentStruct'
import { navigation } from './useNavigation'
import { useSearch } from './useSearch'

export function useHandleSelect() {
  const { setUI } = useCommandAppUI()
  const { setOptions } = useCommandOptions()
  const { setCurrentCommand } = useCurrentCommand()
  const { setStruct } = useCurrentStruct()
  const { setLoading } = useCommandAppLoading()
  const { setSearch } = useSearch()
  const { structs } = useStructs()

  return async (item: ICommandItem, opt = {} as CommandOptions) => {
    setOptions(opt)
    setCurrentCommand(item)

    if (item.data.type === 'Creation') {
      const struct = structs.find((s) => s.id === item.data.creation?.structId)
      if (struct?.isQuicklink) {
        const linkColumn = struct.columns.find((c) => c.slug === 'link')
        const link = item.data.creation?.cells?.[linkColumn?.id!]
        if (link) {
          window.electron.ipcRenderer.send('open-url', link)
        }
        setSearch('')
        window.customElectronApi.togglePanelWindow()
      } else {
        navigation.push({ path: '/edit-creation' })
      }
      return
    }

    // setSearch('')

    if (item.data.type === 'Command') {
      navigation.push({
        path: '/extension',
      })
      item.data?.afterOpen?.()
      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }

    if (item.data.commandName === 'marketplace') {
      setUI({ type: 'marketplace' })

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }

    if (item.data?.type === 'Struct') {
      setStruct(item.data.struct!.raw)
      setUI({ type: 'struct' })

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }

    if (item.data?.type === 'Application') {
      const { applicationPath } = item.data
      // await invoke('open_command', { path: applicationPath })
    }
  }
}
