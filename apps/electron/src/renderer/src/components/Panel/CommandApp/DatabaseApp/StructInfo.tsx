import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { Button } from '@penx/uikit/ui/button'
import { AddColumnBtn } from './AddColumnBtn'
import { ColumnList } from './ColumnList'
import { StructPropDrawer } from './StructPropDrawer'

interface Props {
  struct: Struct
  readonly?: boolean
}

export function StructInfo({ struct, readonly = false }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="px-3 font-bold">
          <Trans>Properties</Trans>
        </div>
        {!readonly && <AddColumnBtn struct={struct} />}
      </div>
      <ColumnList struct={struct} readonly={readonly} />
      <StructPropDrawer />
    </div>
  )
}
