import { Trans } from '@lingui/react/macro'
import { Plus } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { currentCreationAtom } from '~/hooks/useCurrentCreation'
import { useNavigations } from '~/hooks/useNavigations'

interface Props {
  struct: Struct
}

export const AddRowButton = ({ struct }: Props) => {
  const addCreation = useAddCreation()
  const { push } = useNavigations()
  return (
    <Button
      size="sm"
      className="no-drag absolute right-2 flex cursor-pointer items-center gap-1 rounded-full"
      onClick={async () => {
        const creation = await addCreation({
          isAddPanel: false,
          type: struct.type,
        })
        store.set(currentCreationAtom, creation)
        push({ path: '/edit-creation' })
      }}
    >
      <Plus size={16}></Plus>
      <Trans>Add</Trans>
    </Button>
  )
}
