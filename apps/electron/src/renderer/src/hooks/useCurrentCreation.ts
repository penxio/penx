import { atom, useAtom } from 'jotai'
import { Creation } from '@penx/domain'
import { ICreationNode } from '@penx/model-type'

export const currentCreationAtom = atom<ICreationNode>(
  null as any as ICreationNode,
)

export function useCurrentCreation() {
  const [creation, setCreation] = useAtom(currentCreationAtom)
  return {
    raw: creation,
    creation: creation
      ? new Creation(creation)
      : (undefined as any as Creation),
    setCreation,
  }
}
