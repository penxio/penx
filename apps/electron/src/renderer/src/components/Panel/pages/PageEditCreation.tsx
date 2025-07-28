import { useMemo } from 'react'
import { Creation } from '@penx/components/Creation/Creation'
import { PanelCreationProvider } from '@penx/components/Creation/PanelCreationProvider'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentCreation } from '~/hooks/useCurrentCreation'
import { CommandList } from '../CommandComponents'

export function PageEditCreation() {
  const { creation } = useCurrentCreation()
  const { currentCommand } = useCurrentCommand()
  const creationId = useMemo(() => {
    if (creation) return creation.id
    if (currentCommand?.data?.creation) {
      return currentCommand.data.creation.id
    }
  }, [creation, currentCommand])

  if (!creationId) return null

  return (
    <CommandList className="p-2 outline-none">
      <PanelCreationProvider creationId={creationId}>
        <Creation className="pt-4" />
      </PanelCreationProvider>
    </CommandList>
  )
}
