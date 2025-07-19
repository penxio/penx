import { invoke } from '@tauri-apps/api/core'
import { appEmitter } from '@penx/emitter'
import { ICommandItem } from '~/lib/types'
import { useCommandAppLoading } from './useCommandAppLoading'
import { useCommandAppUI } from './useCommandAppUI'
import { CommandOptions, useCommandOptions } from './useCommandOptions'
import { useCurrentCommand } from './useCurrentCommand'
import { useCurrentStruct } from './useCurrentStruct'
import { useSearch } from './useSearch'

export function useHandleSelect() {
  const { setUI } = useCommandAppUI()
  const { setOptions } = useCommandOptions()
  const { setCurrentCommand } = useCurrentCommand()
  const { setStruct } = useCurrentStruct()
  const { setLoading } = useCommandAppLoading()
  const { setSearch } = useSearch()

  return async (item: ICommandItem, opt = {} as CommandOptions) => {
    setSearch('')
    setOptions(opt)
    if (item.data.commandName === 'quick_input') {
      window.customElectronApi.toggleInputWindow()
      return
    }

    if (item.data.commandName === 'marketplace') {
      setCurrentCommand(item)
      setUI({ type: 'marketplace' })

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }

    if (item.data?.type === 'Struct') {
      setStruct(item.data.struct!.raw)
      setCurrentCommand(item)
      setUI({ type: 'struct' })

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }

    if (item.data?.type === 'Application') {
      const { applicationPath } = item.data
      await invoke('open_command', { path: applicationPath })
    }

    if (item.data?.type === 'Command') {
      setLoading(true)
      setCurrentCommand(item)
      setPosition('COMMAND_APP')

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
    }
  }
}
