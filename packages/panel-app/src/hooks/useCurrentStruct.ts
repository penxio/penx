import { IStructNode } from '@penx/model-type'
import { atom, useAtom } from 'jotai'

export const currentStructAtom = atom<IStructNode>(null as any as IStructNode)

export function useCurrentStruct() {
  const [struct, setStruct] = useAtom(currentStructAtom)
  return { struct, setStruct }
}
