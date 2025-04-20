'use client'

import { useRef, useState } from 'react'
import { uploadFile } from '@/lib/uploadFile'
import { cn, getUrl } from '@penx/utils'
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  getMiddleCenterBias,
  GridCellKind,
  measureTextCached,
  TextCellEntry,
} from '@glideapps/glide-data-grid'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

interface ImageCellProps {
  kind: 'image-cell'
  data: string
}

export type ImageCell = CustomCell<ImageCellProps>

export const imageCellRenderer: CustomRenderer<ImageCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is ImageCell => (c.data as any).kind === 'image-cell',
  draw: (args, cell) => {
    const { ctx, rect, theme, imageLoader, col, row } = args
    const { data } = cell.data

    const xPad = theme.cellHorizontalPadding

    const radius = Math.min(12, rect.height / 2 - theme.cellVerticalPadding)

    const drawX = rect.x + xPad

    const imageResult = imageLoader.loadOrGetImage(
      `${getUrl(data)}?s=40`,
      col,
      row,
    )

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
      const { onChange, value, onFinishedEditing } = p
      return (
        <ImagePreview
          onChange={onChange}
          value={value}
          onFinishedEditing={onFinishedEditing}
        />
      )
    },
  }),
}

interface PreviewProps {
  value: ImageCell
  onChange: (newValue: ImageCell) => void
  onFinishedEditing: (
    newValue?: ImageCell,
    movement?: readonly [-1 | 0 | 1, -1 | 0 | 1],
  ) => void
}

function ImagePreview({ value, onChange, onFinishedEditing }: PreviewProps) {
  const [uploading, setUploading] = useState(false)

  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }

  async function handleFile(file: File) {
    setUploading(true)

    try {
      const data = await uploadFile(file)
      toast.success('Image uploaded successfully!')

      const newValue: ImageCell = {
        ...value,
        data: {
          ...value.data,
          data: data.url!,
        },
      }

      onChange(newValue)
      onFinishedEditing(newValue)
    } catch (error) {
      console.log('error:', error)
      toast.error('Upload image failed')
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 pb-3">
      {value.data.data && (
        <img
          className="h-auto;f w-full"
          src={getUrl(value.data.data)}
          alt={''}
        />
      )}
      <div className={cn('flex items-center justify-center')}>
        <a
          onClick={handleClick}
          className="text-foreground/50 hover:text-brand flex w-full cursor-pointer items-center gap-2 bg-transparent text-sm"
        >
          {!uploading && <UploadCloud size={20} />}
          {!uploading && <div>Upload a image</div>}
          {uploading && (
            <div className="flex items-center gap-x-2">
              <div>Uploading...</div>
            </div>
          )}
        </a>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const fileUploaded = event.target.files?.[0]!
            handleFile(fileUploaded)
          }}
          ref={hiddenFileInput}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
