'use client'

import { bgColorMaps } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
}
export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const colorEntries = Object.entries(bgColorMaps)

  return (
    <div className="grid grid-cols-4 items-center justify-between gap-4">
      {colorEntries.slice(0, 16).map(([color, bg]) => (
        <div className="flex flex-1 items-center justify-center" key={color}>
          <div
            className={cn(
              'flex size-12 cursor-pointer items-center justify-center rounded-md transition-colors hover:scale-x-105',
              value === color && 'bg-foreground/10',
            )}
            onClick={() => onChange(color)}
          >
            <div
              className={cn(
                'size-8 cursor-pointer rounded-full transition-colors hover:scale-110',
                bg,
                value === color && '',
              )}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
