import { ICommandItem } from '@/lib/types'
import { atom, useAtom } from 'jotai'

export const commands: ICommandItem[] = []

export const commandsAtom = atom<ICommandItem[]>(commands)

export function useCommands() {
  const [commands] = useAtom(commandsAtom)
  return { commands }
}
