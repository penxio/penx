import { useQuery } from '@tanstack/react-query'
import { Creation } from '@penx/components/Creation/Creation'
import { PanelCreationProvider } from '@penx/components/Creation/PanelCreationProvider'
import { DatabaseProvider } from '@penx/components/DatabaseProvider'
import { Creation as CreationDomain, Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { localDB } from '@penx/local-db'
import { useCommandOptions } from '~/hooks/useCommandOptions'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCreation } from '~/hooks/useCurrentCreation'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useSearch } from '~/hooks/useSearch'
import { DatabaseDetail } from './DatabaseDetail'
import { StructInfo } from './StructInfo'

export function DatabaseApp() {
  const {
    struct: { id },
  } = useCurrentStruct()
  const { structs } = useStructs()
  const { search } = useSearch()
  const { creation } = useCurrentCreation()
  const { options } = useCommandOptions()

  const struct = structs.find((s) => s.id === id)!

  const { isCommandAppDetail, setPosition } = useCommandPosition()

  if (!struct) return null
  if (isCommandAppDetail && creation) {
    return (
      <PanelCreationProvider creationId={creation.id}>
        <Creation className="pt-4" />
      </PanelCreationProvider>
    )
  }

  if (options.isEditStructProp) {
    return (
      <DatabaseProvider struct={struct}>
        <StructInfo struct={struct} />
      </DatabaseProvider>
    )
  }

  return <DatabaseDetail struct={struct.raw} text={search} />
}
