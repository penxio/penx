import { useQuery } from '@tanstack/react-query'
import { Creation } from '@penx/components/Creation/Creation'
import { PanelCreationProvider } from '@penx/components/Creation/PanelCreationProvider'
import { Creation as CreationDomain } from '@penx/domain'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCreation } from '~/hooks/useCurrentCreation'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useSearch } from '~/hooks/useSearch'
import { StyledCommandGroup } from '../../CommandComponents'
import { DatabaseDetail } from './DatabaseDetail'

export function DatabaseApp() {
  const { struct } = useCurrentStruct()
  const { search } = useSearch()
  const { creation } = useCurrentCreation()

  const { data, isLoading } = useQuery({
    queryKey: ['struct', struct.id],
    queryFn: () => localDB.getNode<IStructNode>(struct.id),
  })

  const { isCommandAppDetail, setPosition } = useCommandPosition()

  if (isLoading || !data) {
    return <StyledCommandGroup></StyledCommandGroup>
  }

  if (isCommandAppDetail && creation) {
    return (
      <PanelCreationProvider creationId={creation.id}>
        <Creation className="pt-4" />
      </PanelCreationProvider>
    )
  }
  return <DatabaseDetail struct={data} text={search} />
}
