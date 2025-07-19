import { Creation } from '@penx/components/Creation/Creation'
import { PanelCreationProvider } from '@penx/components/Creation/PanelCreationProvider'
import { useCurrentCreation } from '~/hooks/useCurrentCreation'
import { CommandList } from '../CommandComponents'

export function PageEditCreation() {
  const { creation } = useCurrentCreation()
  return (
    <CommandList className="p-2 outline-none">
      <PanelCreationProvider creationId={creation.id}>
        <Creation className="pt-4" />
      </PanelCreationProvider>
    </CommandList>
  )
}
