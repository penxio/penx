import { darken, transparentize } from '@fower/color-helper'
import { XIcon } from 'lucide-react'
import { colorNameMaps, getBgColor } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { useTheme } from '../theme-provider'

interface IOption {
  id: string
  name: string
  color: string
}

interface Props {
  option: IOption
  showClose?: boolean
  deletable?: boolean
  className?: string
  onDelete?: () => void
}

export function OptionTag({
  option,
  className,
  showClose = false,
  deletable = false,
  onDelete,
}: Props) {
  const color = option?.color
  const { isDark } = useTheme()

  return (
    <div
      key={option.id}
      className={cn(
        'optionTag relative inline-flex cursor-pointer items-center justify-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-white',
        // getBgColor(color),

        className,
      )}
      style={{
        color: color
          ? isDark
            ? '#fff'
            : '#444'
          : darken(colorNameMaps[color], 10),
        background: transparentize(colorNameMaps[color], isDark ? 10 : 80),
      }}
    >
      <div>{option ? option.name : ''}</div>
      {deletable && (
        <div
          className="remove-option text-background bg-brand absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
        >
          <XIcon size={10}></XIcon>
        </div>
      )}

      {showClose && (
        <div className="inline-flex">
          <XIcon size={10}></XIcon>
        </div>
      )}
    </div>
  )
}
