import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
  TextCellEntry,
} from '@glideapps/glide-data-grid'
import { dataDir } from '@tauri-apps/api/path'
import { Creation } from '@penx/domain'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'

interface PrimaryCellProps {
  kind: 'primary-cell'
  record: Creation
  data: string
}

export type PrimaryCell = CustomCell<PrimaryCellProps>

export const primaryCellRenderer: CustomRenderer<PrimaryCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is PrimaryCell => (c.data as any).kind === 'primary-cell',
  draw: (args, cell) => {
    const { data = '' } = cell.data
    drawTextCell(args, data)
    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p

      return (
        <div className="primary-cell relative flex w-full flex-1 items-center justify-between gap-1">
          <TextCellEntry
            highlight={true}
            // autoFocus={false}
            // disabled={true}
            className="w-full flex-1 h-full"
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
          <span
            className="border/10 text-foreground/60 hover:border-foreground bg-background hover:bg-foreground/5  flex h-6 cursor-pointer items-center rounded-md border px-1 text-xs font-medium"
            onClick={() => {
              store.panels.updateMainPanel({
                type: PanelType.CREATION,
                creationId: value.data.record.id,
              })
            }}
          >
            OPEN
          </span>
        </div>
      )
    },
  }),
}
