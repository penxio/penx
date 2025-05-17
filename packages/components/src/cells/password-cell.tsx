import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
  TextCellEntry,
} from '@glideapps/glide-data-grid'

interface PasswordCellProps {
  kind: 'password-cell'
  data: string
}

export type PasswordCell = CustomCell<PasswordCellProps>

export const passwordCellRenderer: CustomRenderer<PasswordCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is PasswordCell => (c.data as any).kind === 'password-cell',
  draw: (args, cell) => {
    const { data = '' } = cell.data
    drawTextCell(args, data)
    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p

      return (
        <TextCellEntry
          highlight={true}
          // autoFocus={false}
          // disabled={true}
          value={value.data.data ?? ''}
          onChange={(e) => {
            onChange({
              ...value,
              data: {
                ...value.data,
                data: e.target.value,
              },
            })
          }}
        />
      )
    },
  }),
}
