import { Creation } from '@penx/domain'
import { useMolds } from '@penx/hooks/useMolds'

export function useCreationMold(creation: Creation) {
  const { molds } = useMolds()
  const mold = molds.find((m) => m.id === creation.moldId)
  return mold!
}
