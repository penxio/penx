import { DatabaseProvider } from '@penx/components/DatabaseProvider'
import { EditStructForm } from '@penx/components/StructDialog/EditStructForm'
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
      <div className="divide-foreground/10 flex  h-full justify-between divide-x">
        <div className="flex-1 overflow-auto p-3">
          <EditStructForm struct={struct} />
        </div>
        <div className="flex-1 overflow-auto p-1">
          <StructInfo struct={struct} />
        </div>
      </div>
    </DatabaseProvider>
  )
}
