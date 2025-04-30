import { useMolds } from '@penx/hooks/useMolds'
import { ICreation } from '@penx/model-type/ICreation'

export function useCreationMold(creation: ICreation) {
  const { molds } = useMolds()
  const mold = molds.find((m) => m.id === creation.moldId)
  return mold!
}
