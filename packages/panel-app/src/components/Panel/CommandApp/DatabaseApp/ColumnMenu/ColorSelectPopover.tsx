import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { colorNames, getBgColor } from '@penx/libs/color-helper'
import { Option } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'

interface Props {
  option: Option
  value: string
  onChange: (value: string) => void
}

export const ColorSelectPopover = ({ option, value, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'mr-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-white',
            getBgColor(option.color),
          )}
          onClick={() => setOpen(false)}
        >
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="grid w-[200px] grid-cols-4 gap-1 p-2"
      >
        {colorNames.map((color) => (
          <div
            key={color}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:scale-x-105',
              value === color && 'bg-foreground/10',
            )}
            onClick={() => {
              onChange(color)
              setOpen(false)
            }}
          >
            <div
              className={cn(
                'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
                getBgColor(color),
                value === color && '',
              )}
            ></div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
