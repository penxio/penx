import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { currentCommandAtom } from '~/hooks/useCurrentCommand'
import { itemsAtom } from '~/hooks/useItems'
import { navigation } from '~/hooks/useNavigation'
import { searchAtom } from '~/hooks/useSearch'

type Params = {
  name?: string
  id?: string
  data?: Record<string, any>
}
export const openCommand = (params: Params) => {
  console.log('=====params:', params)

  const commands = store.get(itemsAtom)
  const command = commands.find(
    (c) => c.data.commandName === params.name || c.id === params.id,
  )!
  store.set(currentCommandAtom, command)

  store.set(searchAtom, '')
  navigation.push({ path: '/extension', data: params.data })

  appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
}
