'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pen,
  Trash,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useDatabaseContext } from '@penx/components/database-ui'
import { IColumn } from '@penx/model-type'
import { Input } from '@penx/uikit/input'
import { Menu, MenuItem } from '@penx/uikit/menu'
import { useDeleteColumnDialog } from '../DeleteColumnDialog/useDeleteColumnDialog'
import { EditField } from './EditField'

interface ColumnMenuProps {
  index?: number
  column: IColumn
  close: () => void
}
export function ColumnMenu({ index = 0, column, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()
  const [name, setName] = useState(column.name || '')
  const [isEditField, setIsEditField] = useState(false)
  const { setState } = useDeleteColumnDialog()

  const viewColumn = ctx.currentView.viewColumns.find(
    (i) => i.columnId === column.id,
  )!
  const [width, setWidth] = useState(viewColumn.width || 120)

  async function moveColumn(fromIndex: number, toIndex: number) {
    await ctx.sortColumns(fromIndex, toIndex)
    close()
  }

  async function updateColumnName() {
    await ctx.updateColumnName(column.id, name)
    close()
  }

  async function updateColumnWidth() {
    await ctx.updateColumnWidth(column.id, Number(width as any))
    close()
  }

  if (isEditField) {
    return (
      <EditField
        close={close}
        column={column}
        onSave={() => setIsEditField(false)}
        onCancel={() => setIsEditField(false)}
      />
    )
  }

  return (
    <div>
      <div className="p-2">
        <div className="text-foreground/40 mb-1 text-sm">
          <Trans>Display name</Trans>
        </div>
        <Input
          size="sm"
          value={name}
          onBlur={() => {
            updateColumnName()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateColumnName()
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>

      <div className="p-2">
        <div className="text-foreground/40 mb-1 text-sm">Column width</div>
        <Input
          size="sm"
          type="number"
          value={width}
          onBlur={() => {
            updateColumnWidth()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateColumnWidth()
            }
          }}
          onChange={(e) => {
            setWidth(Number(e.target.value))
          }}
        />
      </div>

      <Menu>
        {index !== 0 && (
          <MenuItem className="gap-2" onClick={() => setIsEditField(true)}>
            <div>
              <Pen size={16} />
            </div>
            <div>Edit column</div>
          </MenuItem>
        )}

        <MenuItem
          className="gap-2"
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <div>
            <ArrowUp size={16} />
          </div>
          <div>Sort ascending</div>
        </MenuItem>
        <MenuItem
          className="gap-2"
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <div>
            <ArrowDown size={16} />
          </div>
          <div>Sort descending</div>
        </MenuItem>

        {index !== 0 && (
          <>
            {index > 1 && (
              <MenuItem
                className="gap-2"
                onClick={() => moveColumn(index, index - 1)}
              >
                <div>
                  <ArrowLeft size={16} />
                </div>
                <div>Move to left</div>
              </MenuItem>
            )}

            {index < ctx.struct.columns.length - 1 && (
              <MenuItem
                className="gap-2"
                onClick={() => moveColumn(index, index + 1)}
              >
                <div>
                  <ArrowRight size={16} />
                </div>
                <div>Move to right</div>
              </MenuItem>
            )}

            <MenuItem
              className="gap-2"
              onClick={() => {
                setState({
                  isOpen: true,
                  column: column,
                })
                close()
              }}
            >
              <div>
                <Trash2 size={16} />
              </div>
              <div>Delete column</div>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}
