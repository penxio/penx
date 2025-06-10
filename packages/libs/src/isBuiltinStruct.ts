import { StructType } from '@penx/types'

export function isBuiltinStruct(structType: any) {
  return Object.values(StructType).includes(structType)
}
