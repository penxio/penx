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
    <div className="flex flex-wrap items-center gap-2">
      {colorEntries.map(([color, bg]) => (
        <div
          key={color}
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:scale-x-105',
            value === color && 'bg-foreground/10',
          )}
          onClick={() => onChange(color)}
        >
          <div
            className={cn(
              'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
              bg,
              value === color && '',
            )}
          ></div>
        </div>
      ))}
    </div>
  )
}
