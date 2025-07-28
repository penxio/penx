import { appEmitter } from '@penx/emitter'
import { ICommandItem } from '~/lib/types'
import { useCommandAppUI } from './useCommandAppUI'
import { CommandOptions, useCommandOptions } from './useCommandOptions'
import { useCurrentCommand } from './useCurrentCommand'
import { useCurrentStruct } from './useCurrentStruct'
import { useNavigation } from './useNavigation'
import { useSearch } from './useSearch'

export function useSelectStruct() {
  const { setUI } = useCommandAppUI()
  const { setOptions } = useCommandOptions()
  const { setCurrentCommand } = useCurrentCommand()
  const { setStruct } = useCurrentStruct()
  const { setSearch } = useSearch()
  const { push } = useNavigation()

  return async (item: ICommandItem, opt = {} as CommandOptions) => {
    setSearch('')
    setOptions(opt)
    setStruct(item.data.struct!.raw)
    setCurrentCommand(item)

    push({
      path: '/struct-creations',
      data: {
        struct: item.data.struct,
      },
    })

    appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
  }
}
