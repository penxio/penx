import { Dispatch, SetStateAction, useEffect } from 'react'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { commandUIAtom, useCommandAppUI } from './useCommandAppUI'
import { positionAtom } from './useCommandPosition'
import { currentCommandAtom } from './useCurrentCommand'
import { useCommands, useItems } from './useItems'
import { searchAtom, useSearch } from './useSearch'

export function useReset(setQ: (value: string) => void) {
  const { setItems } = useItems()
  const { commands } = useCommands()

  useEffect(() => {
    function reset() {
      if (commands.length) {
        setItems(commands)
      }

      const position = store.get(positionAtom)

      console.log('=======position:', position)

      if (position === 'COMMAND_APP') {
        const search = store.get(searchAtom)
        console.log('===========search:', search)

        store.set(searchAtom, '')

        if (!search) {
          store.set(positionAtom, 'ROOT')
          store.set(currentCommandAtom, null as any)
          store.set(commandUIAtom, {} as any)
        }
      }

      if (position === 'COMMAND_APP_DETAIL') {
        store.set(positionAtom, 'COMMAND_APP')
      }

      setQ('')
    }

    appEmitter.on('ON_ESCAPE_IN_COMMAND', reset)
    return () => {
      appEmitter.off('ON_ESCAPE_IN_COMMAND', reset)
    }
  }, [])
}
