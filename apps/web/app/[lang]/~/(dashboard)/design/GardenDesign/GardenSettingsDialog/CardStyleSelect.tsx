'use client'

import { ToggleGroup, ToggleGroupItem } from '@penx/ui/components/toggle-group'
import { CardStyle } from '@/lib/constants'
import { Trans } from '@lingui/react/macro'

interface Props {
  value: CardStyle
  onChange: (value: CardStyle) => void
}

export function CardStyleSelect({ value, onChange }: Props) {
  return (
    <ToggleGroup
      className="w-auto"
      size="lg"
      value={value || CardStyle.SHADOW}
      onValueChange={(v) => {
        onChange(v as any)
      }}
      type="single"
    >
      <ToggleGroupItem value={CardStyle.SHADOW} className="">
        <Trans>Shadow</Trans>
      </ToggleGroupItem>

      <ToggleGroupItem value={CardStyle.BORDERED} className="">
        <Trans>Bordered</Trans>
      </ToggleGroupItem>

      <ToggleGroupItem value={CardStyle.UNSTYLED} className="">
        <Trans>Unstyled</Trans>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
