import DatePicker from 'react-datepicker'
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import { format } from 'date-fns'

interface DateCellProps {
  kind: 'date-cell'
  data: any // TODO: handle any
}

export type DateCell = CustomCell<DateCellProps>

export const dateCellRenderer: CustomRenderer<DateCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is DateCell => (c.data as any).kind === 'date-cell',
  draw: (args, cell) => {
    const { ctx, theme, rect } = args
    const { data } = cell.data
    let str = ''

    if (data) {
      str = format(new Date(data), 'yyyy-MM-dd HH:mm:ss')
    }
    drawTextCell(args, str)
    return true
  },
  provideEditor: () => ({
    disablePadding: true,
    editor: (p) => {
      const {
        onChange,
        value,
        forceEditMode,
        validatedSelection,
        onFinishedEditing,
      } = p

      const currentDate = value.data.data ?? null

      return (
        <DatePicker
          className="date-cell"
          selected={currentDate}
          dateFormat="yyyy-MM-dd"
          inline
          onChange={(date) => {
            const newValue: DateCell = {
              ...value,
              data: {
                ...value.data,
                data: date,
              },
            }

            onChange(newValue)
            onFinishedEditing(newValue)
          }}
        />
      )
    },
  }),
}
