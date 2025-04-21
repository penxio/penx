'use client'

import { Trans } from '@lingui/react'
import { CardStyle } from '@penx/constants'
import { ToggleGroup, ToggleGroupItem } from '@penx/uikit/ui/toggle-group'

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
        <Trans id="Shadow"></Trans>
      </ToggleGroupItem>

      <ToggleGroupItem value={CardStyle.BORDERED} className="">
        <Trans id="Bordered"></Trans>
      </ToggleGroupItem>

      <ToggleGroupItem value={CardStyle.UNSTYLED} className="">
        <Trans id="Unstyled"></Trans>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
