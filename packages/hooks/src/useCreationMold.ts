import { useMoldsContext } from '@penx/contexts/MoldsContext'
import { ICreation } from '@penx/model-type/ICreation'

export function useCreationMold(creation: ICreation) {
  const molds = useMoldsContext()
  const mold = molds.find((m) => m.id === creation.moldId)
  return mold!
}
