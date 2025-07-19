import { useStructs } from '@penx/hooks/useStructs'
import { useCommandOptions } from '~/hooks/useCommandOptions'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useSearch } from '~/hooks/useSearch'
import { DatabaseDetail } from './DatabaseDetail'

export function DatabaseApp() {
  const {
    struct: { id },
  } = useCurrentStruct()
  const { structs } = useStructs()
  const { search } = useSearch()
  const { options } = useCommandOptions()

  const struct = structs.find((s) => s.id === id)!

  if (!struct) return null

  return <DatabaseDetail struct={struct.raw} text={search} />
}
