import React, { useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { Drawer } from '@/components/ui/Drawer'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useLingui } from '@lingui/react/macro'
import EmojiPickerReact, { Emoji, EmojiStyle } from 'emoji-picker-react'

interface Props {
  value: string
  onChange: (unified: string) => void
}

export function EmojiPicker({ value = '1f435', onChange }: Props) {
  const { theme, isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const { i18n } = useLingui()

  return (
    <>
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-neutral-800"
        onClick={() => {
          setOpen(true)
        }}
      >
        <Emoji unified={value} size={25} />
      </div>

      <Drawer open={open} setOpen={setOpen} className="p-0">
        <EmojiPickerReact
          searchDisabled
          width="100%"
          height="60vh"
          className="emoji-picker"
          onEmojiClick={async (v) => {
            await Haptics.impact({ style: ImpactStyle.Medium })
            setOpen(false)
            onChange?.(v.unified)
          }}
        />
      </Drawer>
    </>
  )
}
