'use client'

import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  getMiddleCenterBias,
  GridCellKind,
  measureTextCached,
  TextCellEntry,
} from '@glideapps/glide-data-grid'

interface FileCellProps {
  kind: 'file-cell'
  url: string
  name?: string
}

export type FileCell = CustomCell<FileCellProps>

export const fileCellRenderer: CustomRenderer<FileCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is FileCell => (c.data as any).kind === 'file-cell',
  draw: (args, cell) => {
    const { ctx, rect, theme, imageLoader, col, row } = args
    const { url, name } = cell.data

    const xPad = theme.cellHorizontalPadding

    const radius = Math.min(12, rect.height / 2 - theme.cellVerticalPadding)

    const drawX = rect.x + xPad

    const imageResult = imageLoader.loadOrGetImage(`${url}?s=40`, col, row)

    ctx.save()
    ctx.beginPath()
    ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, Math.PI * 2)
    ctx.globalAlpha = 0.2
    ctx.fill()
    ctx.globalAlpha = 1

    if (imageResult !== undefined) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, Math.PI * 2)
      // ctx.clip()

      ctx.drawImage(
        imageResult,
        drawX,
        rect.y + rect.height / 2 - radius,
        radius * 2,
        radius * 2,
      )

      ctx.restore()
    }

    ctx.restore()

    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p
      return <ImagePreview {...value.data} />
    },
  }),
}

function ImagePreview(props: FileCellProps) {
  const { url, name } = props
  // console.log('=========ImagePreview props:', props)

  return (
    <div>
      <img src={`${url}?s=800`} alt={name} />
    </div>
  )
}
