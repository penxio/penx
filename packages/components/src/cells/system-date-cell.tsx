import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import { format } from 'date-fns'

interface SystemDateCellProps {
  kind: 'system-date-cell'
  data: string | Date
}

export type SystemDateCell = CustomCell<SystemDateCellProps>

export const systemDateCellRenderer: CustomRenderer<SystemDateCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is SystemDateCell =>
    (c.data as any).kind === 'system-date-cell',
  draw: (args, cell) => {
    const date = cell.data.data

    const str = format(new Date(date), 'yyyy-MM-dd HH:mm:ss')

    drawTextCell(args, str)
    return true
  },
  provideEditor: () => ({
    disablePadding: true,
    editor: (p) => {
      return null
    },
  }),
}
