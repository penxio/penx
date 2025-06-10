import React, { useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { Drawer } from '@/components/ui/Drawer'
import { impact } from '@/lib/impact'
import { transparentize } from '@fower/color-helper'
import { useLingui } from '@lingui/react/macro'
import EmojiPickerReact, { Emoji, EmojiStyle } from 'emoji-picker-react'
import { colorNameMaps } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'

interface Props {
  color?: string
  value: string
  onChange: (unified: string) => void
}

export function EmojiPicker({ value = '1f435', color, onChange }: Props) {
  const { theme, isDark } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          'size-18 shadow-card flex shrink-0 items-center justify-center rounded-lg bg-white dark:bg-neutral-800',
          color && colorNameMaps[color],
        )}
        style={{
          background: color
            ? transparentize(colorNameMaps[color], 88)
            : undefined,
        }}
        onClick={() => {
          setOpen(true)
        }}
      >
        <Emoji unified={value} size={50} />
      </div>

      <Drawer open={open} setOpen={setOpen} className="p-0">
        <EmojiPickerReact
          searchDisabled
          width="100%"
          height="60vh"
          className="emoji-picker"
          onEmojiClick={async (v) => {
            impact()
            setOpen(false)
            onChange?.(v.unified)
          }}
        />
      </Drawer>
    </>
  )
}
