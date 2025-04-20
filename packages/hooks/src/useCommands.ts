import { commandsAtom } from '@penx/store'
import { useAtom } from 'jotai'

export function useCommands() {
  const [commands] = useAtom(commandsAtom)
  return { commands }
}
