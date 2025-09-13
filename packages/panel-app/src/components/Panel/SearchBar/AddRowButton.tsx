import { useEffect } from 'react'
import { Trans } from '@lingui/react/macro'
import { Plus, PlusIcon } from 'lucide-react'
import { tinykeys } from 'tinykeys'
import { Kbd } from '@penx/components/Kbd'
import { isDesktop } from '@penx/constants'
import { Creation, Struct } from '@penx/domain'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { currentCreationAtom } from '../../../hooks/useCurrentCreation'
import { navigation } from '../../../hooks/useNavigation'

interface Props {
  struct: Struct
}

export const AddRowButton = ({ struct }: Props) => {
  const addCreation = useAddCreation()
  const { push } = navigation

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
      className="no-drag bg-foreground/8 hover:bg-foreground/12  flex cursor-pointer items-center gap-1"
      onClick={async () => {
        add()
      }}
    >
      <div className={cn(isDesktop && 'mr-1')}>
        {/* <Trans>Add</Trans> */}
        <PlusIcon size={20} />
      </div>
      {isDesktop && (
        <>
          <Kbd className="">⌘</Kbd>
          <Kbd className="">N</Kbd>
        </>
      )}
    </Button>
  )
}
