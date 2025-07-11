import { atom, useAtom } from 'jotai'
import { IListItem } from '@penx/extension-api'
import { ICommandItem } from '~/lib/types'

export const currentCommandAtom = atom<ICommandItem>(
  null as any as ICommandItem,
)

export function useCurrentCommand() {
  const [currentCommand, setCurrentCommand] = useAtom(currentCommandAtom)
  return { currentCommand, setCurrentCommand }
}
