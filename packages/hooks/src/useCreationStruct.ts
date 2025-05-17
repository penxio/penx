import { Creation } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'

export function useCreationStruct(creation: Creation) {
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === creation.structId)
  return struct!
}
