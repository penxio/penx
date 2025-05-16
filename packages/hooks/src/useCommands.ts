import { useAtom } from 'jotai'
import { commandsAtom } from '@penx/store'

export function useCommands() {
  const [commands] = useAtom(commandsAtom)
  return { commands }
}
