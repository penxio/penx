import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { PropList } from '@penx/components/Creation/PropList/PropList'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { IColumn } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/NovelEditor'
import { ColumnType } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'
import { mappedByKey } from '@penx/utils'
import { CreationImage } from './CreationImage'

interface Props {
  creation: Creation
}

export function CreationDetail({ creation }: Props) {
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === creation.structId)!
  if (!struct) return null
  const currentView = struct.views[0]
  const viewColumns = currentView.viewColumns
  const columnMap = mappedByKey(struct.columns, 'id')
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 p-2">
        {struct.isImage ? (
          <CreationImage creation={creation} />
        ) : (
          <NovelEditor editable={false} value={creation.content} />
        )}
      </div>

      <PropList
        className="divide-foreground/5 border-foreground/6 flex flex-col divide-y border-t text-xs gap-0"
        isPanel
        struct={struct}
        creation={creation}
        onUpdateProps={(newCells) => {
          updateCreationProps(creation.id, { cells: newCells })
        }}
      />
    </div>
  )
}
