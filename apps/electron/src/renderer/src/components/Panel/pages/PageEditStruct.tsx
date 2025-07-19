import { DatabaseProvider } from '@penx/components/DatabaseProvider'
import { useStructs } from '@penx/hooks/useStructs'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { StructInfo } from '../CommandApp/DatabaseApp/StructInfo'

export function PageEditStruct() {
  const {
    struct: { id },
  } = useCurrentStruct()
  const { structs } = useStructs()

  const struct = structs.find((s) => s.id === id)!
  return (
    <DatabaseProvider struct={struct}>
      <StructInfo struct={struct} />
    </DatabaseProvider>
  )
}
