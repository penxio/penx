import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useIsAddRow } from '~/hooks/useIsAddRow'
import { useSearch } from '~/hooks/useSearch'
import { StyledCommandGroup } from '../../CommandComponents'
import { DatabaseDetail } from './DatabaseDetail'

export function DatabaseApp() {
  const { struct } = useCurrentStruct()
  const { search } = useSearch()
  const { isAddRow } = useIsAddRow()

  const { data, isLoading } = useQuery({
    queryKey: ['struct', struct.id],
    queryFn: () => localDB.getNode<IStructNode>(struct.id),
  })

  if (isLoading || !data) {
    return <StyledCommandGroup></StyledCommandGroup>
  }

  // if (isAddRow) return <AddRowForm {...data} />
  return <DatabaseDetail struct={data} text={search} />
}
