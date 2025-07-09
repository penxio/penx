import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { store } from '@penx/store'
import { useAppMode } from '~/hooks/useAppMode'
import { currentStructAtom } from '~/hooks/useCurrentStruct'
import { isAddRowAtom } from '~/hooks/useIsAddRow'
import { Button } from '@penx/uikit/ui/button'
import { Trans } from '@lingui/react/macro'

interface Props {}

export const AddRowButton = ({}: Props) => {
  const { isEditor, setMode } = useAppMode()
  return (
    <Button
      className="absolute right-2 rounded-full flex items-center gap-1"
      onClick={async () => {
        //
      }}
    >
      <Box inlineFlex>
        <Plus size={16}></Plus>
      </Box>
      <Box>
        <Trans>Add Row</Trans>
      </Box>
    </Button>
  )
}
