import { isDesktop } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useStructs } from '@penx/hooks/useStructs'
import { hidePanelWindow } from '../lib/hidePanelWindow'
import { ICommandItem } from '../lib/types'
import { useCommandAppLoading } from './useCommandAppLoading'
import { useCommandAppUI } from './useCommandAppUI'
import { CommandOptions, useCommandOptions } from './useCommandOptions'
import { useCurrentCommand } from './useCurrentCommand'
import { useCurrentCreation } from './useCurrentCreation'
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
  const { setCreation } = useCurrentCreation()

  return async (item: ICommandItem, opt = {} as CommandOptions) => {
    setOptions(opt)
    setCurrentCommand(item)

    if (item.data.type === 'Creation') {
      setCreation(item.data.creation?.raw!)
      const struct = structs.find((s) => s.id === item.data.creation?.structId)!

      const cells = item.data.creation!.getCells(struct!)

      if (struct?.isQuicklink) {
        const link = cells.link
        if (link) {
          if (isDesktop) {
            window.electron.ipcRenderer.send('open-url', link)
          } else {
            window.open(link)
          }
        }
        setSearch('')
        isDesktop && window.customElectronApi.togglePanelWindow()
        return
      }

      if (struct.isBookmark) {
        const url = cells.url

        if (isDesktop) {
          window.electron.ipcRenderer.send('open-url', url)
          hidePanelWindow()
        } else {
          window.open(url)
        }
        return
      }

      if (struct?.isAICommand) {
        navigation.push({ path: '/ai-command' })
        return
      }

      if (struct.isBrowserTab) {
        appEmitter.emit('OPEN_BROWSER_TAB', cells)
        return
      }

      navigation.push({ path: '/edit-creation' })

      // alert('name.....')
      navigation.push({ path: '/edit-creation' })
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
