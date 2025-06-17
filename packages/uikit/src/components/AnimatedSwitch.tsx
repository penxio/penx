import React, { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function AnimatedSwitch({ checked, onChange }: Props) {
  return (
    <motion.div
      onClick={() => {
        onChange(!checked)
      }}
      className={cn(
        'bg-brand flex h-8 w-14 items-center rounded-full px-[2px]',
        !checked && 'bg-foreground/10',
      )}
      style={{
        justifyContent: !checked ? 'flex-start' : 'flex-end',
      }}
    >
      <motion.div
        layout
        className="size-7 rounded-full bg-white"
        style={{
          boxShadow: '0 0 2px 2px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ type: 'tween' }}
      />
    </motion.div>
  )
}
