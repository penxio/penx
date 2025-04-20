'use client'

import { cn } from '@penx/utils'
import { StripeType } from '@prisma/client'

interface StripeTypeSelectProps {
  value: StripeType
  onSelect: (value: StripeType) => void
}

export function StripeTypeSelect({ value, onSelect }: StripeTypeSelectProps) {
  return (
    <div className="flex gap-2">
      <StripeTypeItem
        selected={value === StripeType.OWN}
        title="Stripe connect"
        description="You have a own Stripe account, user will pay directly to your Stripe account."
        onClick={() => onSelect(StripeType.OWN)}
      />
      <StripeTypeItem
        selected={value === StripeType.PLATFORM}
        title="PenX stripe"
        description="You don't have a own Stripe account, user will pay to PenX, and you can withdraw from PenX."
        onClick={() => onSelect(StripeType.PLATFORM)}
      />
    </div>
  )
}

interface GateItemTypeProps {
  selected?: boolean
  title: string
  description: string
  onClick: () => void
}

function StripeTypeItem({
  selected,
  title,
  description,
  onClick,
}: GateItemTypeProps) {
  return (
    <div
      className={cn(
        'flex-1 cursor-pointer rounded-xl border-2 p-3',
        selected ? 'border-primary' : 'border-secondary',
      )}
      onClick={() => onClick?.()}
    >
      <div className="text-base font-medium">{title}</div>
      <div className="text-foreground/60 text-xs">{description}</div>
    </div>
  )
}
