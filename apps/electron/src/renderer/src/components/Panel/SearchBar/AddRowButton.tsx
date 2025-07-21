import { useEffect } from 'react'
import { Trans } from '@lingui/react/macro'
import { Plus } from 'lucide-react'
import { tinykeys } from 'tinykeys'
import { Kbd } from '@penx/components/Kbd'
import { Creation, Struct } from '@penx/domain'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { currentCreationAtom } from '~/hooks/useCurrentCreation'
import { useNavigation } from '~/hooks/useNavigation'

interface Props {
  struct: Struct
}

export const AddRowButton = ({ struct }: Props) => {
  const addCreation = useAddCreation()
  const { push } = useNavigation()

  async function add() {
    const creation = await addCreation({
      isAddPanel: false,
      type: struct.type,
    })
    store.set(currentCreationAtom, creation)
    push({ path: '/edit-creation' })
  }

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      'Meta+n': () => {
        add()
      },
    })
    return () => {
      unsubscribe()
    }
  })
  return (
    <Button
      size="sm"
      variant="outline"
      className="no-drag bg-foreground/8 hover:bg-foreground/12 absolute right-2 flex cursor-pointer items-center gap-1 rounded-full"
      onClick={async () => {
        add()
      }}
    >
      <div className="mr-1">
        <Trans>Add</Trans>
      </div>
      <Kbd className="">⌘</Kbd>
      <Kbd className="">N</Kbd>
    </Button>
  )
}
