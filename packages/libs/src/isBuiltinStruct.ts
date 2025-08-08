import { StructType } from '@penx/types'

export function isBuiltinStruct(structType: string) {
  return Object.values(StructType).includes(structType as any)
}
