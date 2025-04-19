import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/ui/components/popover'
import { cn } from '@/lib/utils'
import { Colorful } from '@uiw/react-color'

export function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            'h-6 w-6 cursor-pointer rounded-full border shadow transition-colors hover:scale-110',
          )}
          style={{
            background: value,
          }}
        ></div>
      </PopoverTrigger>
      <PopoverContent className="inline-flex w-auto p-0 px-0">
        <Colorful
          className="mx-0"
          style={{}}
          color={value}
          onChange={(color) => {
            onChange(color.hex)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
