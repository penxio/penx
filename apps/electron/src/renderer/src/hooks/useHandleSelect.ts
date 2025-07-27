// import { invoke } from '@tauri-apps/api/core'
import { appEmitter } from '@penx/emitter'
import { ICommandItem } from '~/lib/types'
import { useCommandAppLoading } from './useCommandAppLoading'
import { useCommandAppUI } from './useCommandAppUI'
import { CommandOptions, useCommandOptions } from './useCommandOptions'
import { useCurrentCommand } from './useCurrentCommand'
import { useCurrentStruct } from './useCurrentStruct'
import { useNavigation } from './useNavigation'
import { useSearch } from './useSearch'

export function useHandleSelect() {
  const { setUI } = useCommandAppUI()
  const { setOptions } = useCommandOptions()
  const { setCurrentCommand } = useCurrentCommand()
  const { setStruct } = useCurrentStruct()
  const { setLoading } = useCommandAppLoading()
  const { setSearch } = useSearch()
  const { push } = useNavigation()

  return async (item: ICommandItem, opt = {} as CommandOptions) => {
    setSearch('')
    setOptions(opt)
    setCurrentCommand(item)
    if (item.data.type === 'Command') {
      push({
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
