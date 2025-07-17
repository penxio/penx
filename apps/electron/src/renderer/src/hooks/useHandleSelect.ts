import { invoke } from '@tauri-apps/api/core'
import { appEmitter } from '@penx/emitter'
import { useCommandAppLoading } from './useCommandAppLoading'
import { useCommandAppUI } from './useCommandAppUI'
import { useCommandPosition } from './useCommandPosition'
import { useCurrentCommand } from './useCurrentCommand'
import { useCurrentStruct } from './useCurrentStruct'
import { useSearch } from './useSearch'
import { ICommandItem } from '~/lib/types'

export function useHandleSelect() {
  const { setUI } = useCommandAppUI()
  const { setPosition } = useCommandPosition()
  const { setCurrentCommand } = useCurrentCommand()
  const { setStruct } = useCurrentStruct()
  const { setLoading } = useCommandAppLoading()
  const { setSearch } = useSearch()

  return async (item: ICommandItem, input = '') => {
    if (item.data.commandName === 'marketplace') {
      setSearch('')
      setCurrentCommand(item)
      setUI({ type: 'marketplace' })
      setPosition('COMMAND_APP')

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }
    console.log('======item.data?.type:', item.data?.type)

    if (item.data?.type === 'Struct') {
      console.log('======item.data:', item.data)

      setSearch('')
      setStruct(item.data.struct!.raw)
      setCurrentCommand(item)
      setUI({ type: 'database' })
      setPosition('COMMAND_APP')

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return
    }

    if (item.data?.type === 'Application') {
      const { applicationPath } = item.data
      setSearch('')
      await invoke('open_command', { path: applicationPath })
    }

    if (item.data?.type === 'Command') {
      setSearch('')
      setLoading(true)
      setCurrentCommand(item)

      setPosition('COMMAND_APP')

      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
    }
  }
}
