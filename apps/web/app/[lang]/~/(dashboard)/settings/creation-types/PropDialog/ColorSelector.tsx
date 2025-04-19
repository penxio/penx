import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import { bgColorMaps, textColorMaps } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { PopoverClose } from '@radix-ui/react-popover'

export function ColorSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const colorEntries = Object.entries(bgColorMaps)

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
            value ? `bg-${value}-500` : 'bg-foreground/50',
          )}
        ></div>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="flex flex-wrap items-center gap-2">
          {colorEntries.map(([color, bg]) => (
            <PopoverClose key={color}>
              <div
                className={cn(
                  'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
                  bg,
                )}
                title={color}
                onClick={() => onChange(color)}
              />
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
