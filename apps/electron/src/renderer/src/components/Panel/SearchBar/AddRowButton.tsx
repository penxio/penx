import { Box } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { Plus } from 'lucide-react'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { useAppMode } from '~/hooks/useAppMode'
import { currentStructAtom } from '~/hooks/useCurrentStruct'
import { isAddRowAtom } from '~/hooks/useIsAddRow'

interface Props {}

export const AddRowButton = ({}: Props) => {
  const { isEditor, setMode } = useAppMode()
  return (
    <Button
      className="no-drag absolute right-2 flex cursor-pointer items-center gap-1 rounded-full"
      onClick={async () => {
        //
      }}
    >
      <Box inlineFlex>
        <Plus size={16}></Plus>
      </Box>
      <Box>
        <Trans>Add</Trans>
      </Box>
    </Button>
  )
}
