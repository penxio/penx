import { atom, useAtom } from 'jotai'
import { ICreationNode } from '@penx/model-type'

export const currentCreationAtom = atom<ICreationNode>(
  null as any as ICreationNode,
)

export function useCurrentCreation() {
  const [creation, setCreation] = useAtom(currentCreationAtom)
  return { creation, setCreation }
}
