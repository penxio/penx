import {
  CustomCell,
  CustomRenderer,
  GridCellKind,
  type Item,
} from '@glideapps/glide-data-grid'
import { cn } from '@penx/utils'
import { StarSVG } from '../StarSVG'

interface RateCellProps {
  kind: 'rate-cell'
  data: string
}

export type RateCell = CustomCell<RateCellProps>

const starPoints = [
  [50, 5],
  [61.23, 39.55],
  [97.55, 39.55],
  [68.16, 60.9],
  [79.39, 95.45],
  [50, 74.1],
  [20.61, 95.45],
  [31.84, 60.9],
  [2.45, 39.55],
  [38.77, 39.55],
]

function pathStar(ctx: CanvasRenderingContext2D, center: Item, size: number) {
  let moved = false
  for (const p of starPoints) {
    const x = (p[0]! - 50) * (size / 100) + center[0]
    const y = (p[1]! - 50) * (size / 100) + center[1]

    if (moved) {
      ctx.lineTo(x, y)
    } else {
      ctx.moveTo(x, y)
      moved = true
    }
  }

  ctx.closePath()
}

export const RateCellRenderer: CustomRenderer<RateCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is RateCell => (c.data as any).kind === 'rate-cell',
  draw: (args, cell) => {
    const { ctx, theme, rect, hoverAmount } = args
    const { data: rating = 0 } = cell.data
    const padX = theme.cellHorizontalPadding
    let drawX = rect.x + padX
    const stars = Math.min(5, Math.ceil(Number(rating)))
    drawX += 8
    ctx.beginPath()
    for (let i = 0; i < stars; i++) {
      pathStar(ctx, [drawX, rect.y + rect.height / 2], 16)
      drawX += 18
    }
    ctx.fillStyle = theme.textDark
    ctx.globalAlpha = 0.6 + 0.4 * hoverAmount
    ctx.fill()
    ctx.globalAlpha = 1
    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p

      return (
        <div className="flex">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={cn(
                'relative mr-[2px] h-4 w-4 cursor-pointer',
                Number(value) < index + 1
                  ? 'text-foreground/40'
                  : 'text-yellow-500',
              )}
              onClick={() => {
                onChange({
                  ...p.value,
                  data: {
                    ...p.value.data,
                    data: (index + 1).toString(),
                  },
                })
              }}
            >
              <StarSVG />
            </div>
          ))}
        </div>
      )
    },
  }),
}
