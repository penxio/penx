'use client'

import { useCallback } from 'react'
import { isMobile } from 'react-device-detect'
import {
  DataEditor,
  DataEditorRef,
  GridMouseEventArgs,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { useTheme } from 'next-themes'
import { DATABASE_TOOLBAR_HEIGHT, SIDEBAR_WIDTH } from '@penx/constants'
import { useCreations } from '@penx/hooks/useCreations'
import { getDataEditorTheme } from '@penx/utils/getDataEditorTheme'
import { cellRenderers } from '../../../cells'
import { useDatabaseContext } from '../../DatabaseProvider'
import { AddColumnBtn } from './AddColumnBtn'
import { ConfigColumnDialog } from './ConfigColumnDialog/ConfigColumnDialog'
import { DeleteColumnDialog } from './DeleteColumnDialog/DeleteColumnDialog'
import { useCellMenu } from './hooks/useCellMenu'
import { useColumnMenu } from './hooks/useColumnMenu'
import { useTableView } from './hooks/useTableView'
import { useUndoRedo } from './use-undo-redo'
import '@glideapps/glide-data-grid/dist/index.css'

interface Props {
  width?: number | string
  height: number | string
}

export const TableView = ({ height, width }: Props) => {
  const { struct, theme } = useDatabaseContext()
  const { creationsByStruct } = useCreations()
  const records = creationsByStruct(struct.id)
  const { resolvedTheme } = useTheme()

  const {
    gridRef,
    rowsNum,
    cols,
    sortedColumns,
    getContent,
    setCellValue,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteColumn: onDeleteColumn,
    onRowAppended,
  } = useTableView()

  const {
    gridSelection,
    onGridSelectionChange,
    onCellEdited,
    undo,
    canRedo,
    canUndo,
    redo,
  } = useUndoRedo(gridRef as any, getContent, setCellValue)

  const { setColumnMenu, columnMenuUI } = useColumnMenu(sortedColumns)
  const { setCellMenu, cellMenuUI } = useCellMenu()

  const onHeaderMenuClick = useCallback(
    (col: number, bounds: Rectangle) => {
      console.log('headerMenuClick', col, bounds)
      setColumnMenu({ col, bounds })
    },
    [setColumnMenu],
  )

  const isDark = (theme || resolvedTheme) === 'dark'
  const rowHeight = 36

  const onItemHovered = (data: GridMouseEventArgs) => {
    if (data.kind === 'cell') {
      // console.log('data', data.bounds, data)
    }
  }
  return (
    <div
      className="relative flex p-0"
      style={{
        height: (rowsNum + 2) * rowHeight + 2,
        width: width,
        maxHeight: `calc(100vh - ${DATABASE_TOOLBAR_HEIGHT}px)`,
      }}
    >
      <DeleteColumnDialog onDeleteColumn={onDeleteColumn} />
      <ConfigColumnDialog />
      <DataEditor
        ref={gridRef}
        className="border-foreground/10 m-0 h-full w-full flex-1 border-t p-0"
        columns={cols}
        rowHeight={rowHeight}
        rows={rowsNum}
        freezeColumns={isMobile ? undefined : 1}
        theme={getDataEditorTheme(isDark)}
        smoothScrollX
        smoothScrollY
        height={height}
        width={
          width ||
          (isMobile ? '100vw' : `calc(100vw - ${SIDEBAR_WIDTH + 30}px)`)
        }
        // width={`calc(100vw)`}
        rowMarkers="number"
        getCellsForSelection={true}
        onPaste
        rightElement={<AddColumnBtn />}
        customRenderers={cellRenderers}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        gridSelection={gridSelection ?? undefined}
        onGridSelectionChange={onGridSelectionChange}
        onColumnResize={onColumnResize}
        onColumnResizeEnd={onColumnResizeEnd}
        onHeaderMenuClick={onHeaderMenuClick}
        onItemHovered={onItemHovered}
        onCellContextMenu={(cell, e) => {
          setCellMenu({ row: records[cell[1]], bounds: e.bounds })
          e.preventDefault()
        }}
        onHeaderClicked={(index, event) => {
          // if (isMobile) {
          //   modalController.open(ModalNames.CONFIG_COLUMN, {
          //     index,
          //     column: sortedColumns[index],
          //   })
          // }
        }}
        trailingRowOptions={{
          // How to get the trailing row to look right
          sticky: true,
          tint: true,
          hint: 'New',
        }}
        onRowAppended={onRowAppended}
      />
      {cellMenuUI}
      {columnMenuUI}
    </div>
  )
}
