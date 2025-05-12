import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pen,
  Trash,
  Trash2,
} from 'lucide-react'
import { Record } from '@penx/db/client'
import { MenuItem } from '@penx/uikit/menu'
import { useDatabaseContext } from '../../DatabaseProvider'
import { EditField } from './ColumnMenu/EditField'

interface ColumnMenuProps {
  row: Record
  close: () => void
}

export function CellMenu({ row, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()

  async function deleteRow() {
    ctx.deleteRecord(row.id)
    close()
  }

  return (
    <>
      <>
        <MenuItem
          className="gap-2"
          onClick={async () => {
            deleteRow()
          }}
        >
          <div>
            <Trash2 size={16} />
          </div>
          <div>Delete</div>
        </MenuItem>
      </>
    </>
  )
}
