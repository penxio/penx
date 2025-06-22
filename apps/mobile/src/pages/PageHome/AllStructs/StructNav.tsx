import React, { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'

export enum NavType {
  MY_STRUCT = 'MY_STRUCT',
  MARKETPLACE = 'MARKETPLACE',
}

interface Props {
  navType: NavType
  onSelect: (navType: NavType) => void
}

export function StructNav({ navType, onSelect }: Props) {
  const navs = [
    { id: NavType.MY_STRUCT, label: <Trans>My structs</Trans> },
    { id: NavType.MARKETPLACE, label: <Trans>Marketplace</Trans> },
  ]

  return (
    <div className="bg-foreground/5 relative flex h-12 rounded-xl">
      {navs.map((item) => (
        <div
          key={item.id}
          className={cn(
            'relative flex flex-1 items-center justify-center',
            navType === item.id && 'font-bold',
          )}
          onClick={() => onSelect(item.id)}
        >
          {navType === item.id && (
            <motion.div
              layoutId="tab"
              className="absolute left-1 right-1 top-1 z-10 h-10 rounded-xl bg-white"
              transition={{ type: 'tween', stiffness: 500, damping: 30 }}
            />
          )}

          <span
            className={cn(
              'relative z-20',
              navType === item.id && 'text-foreground dark:text-black',
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
