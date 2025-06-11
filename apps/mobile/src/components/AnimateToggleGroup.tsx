import React, { useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'

type Option = {
  value: string
  label: React.ReactNode
}

interface Props {
  options: Option[]
  value: any
  onChange: (value: any) => void
}

export function AnimateToggleGroup({ options = [], value, onChange }: Props) {
  return (
    <div className="bg-foreground/8 relative flex h-12 rounded-xl">
      {options.map((item) => {
        const selected = value === item.value
        return (
          <div
            key={item.value}
            className={cn(
              'relative flex flex-1 items-center justify-center',
              selected && 'font-bold',
            )}
            onClick={() => {
              impact()
              onChange?.(item.value)
            }}
          >
            {selected && (
              <motion.div
                layoutId="tab"
                className="absolute left-1 right-1 top-1 z-10 h-10 rounded-xl bg-white"
                transition={{ type: 'tween', stiffness: 500, damping: 30 }}
              />
            )}

            <span
              className={cn(
                'relative z-20',
                selected && 'text-foreground dark:text-black',
              )}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
