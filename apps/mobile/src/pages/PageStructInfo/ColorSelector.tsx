'use client'

import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { Menu } from '@/components/ui/Menu'
import { MenuItem } from '@/components/ui/MenuItem'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { bgColorMaps, getBgColor } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const colorEntries = Object.entries(bgColorMaps)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="flex h-12 items-center justify-between gap-3 rounded-xl bg-white px-2 dark:bg-neutral-700"
        onClick={async () => {
          impact()
          setOpen(true)
        }}
      >
        <div className="text-foreground/70 flex shrink-0 items-center gap-0.5">
          <Trans>Color</Trans>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'size-7 cursor-pointer rounded-full transition-colors hover:scale-110',
                getBgColor(value || 'teal'),
              )}
            ></div>
          </div>

          <ChevronRightIcon className="text-foreground/50 size-5" />
        </div>
      </div>

      <Drawer open={open} setOpen={setOpen} className="">
        <DrawerHeader className="">
          <DrawerTitle>
            <Trans>Select a color</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <div className="-mx-4 -mb-6 max-h-[50vh] flex-1 overflow-y-auto px-4 pb-6">
          <Menu>
            {colorEntries.map(([color, bg]) => (
              <MenuItem
                key={color}
                checked={color === value}
                onClick={async () => {
                  setOpen(false)
                  impact()
                  onChange(color)
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'size-8 cursor-pointer rounded-full transition-colors hover:scale-110',
                      bg,
                      value === color && '',
                    )}
                  ></div>
                  <span>{color}</span>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Drawer>
    </>
  )
}
