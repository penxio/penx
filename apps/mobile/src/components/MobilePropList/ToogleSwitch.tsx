import React, { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'

interface ToggleSwitchProps {
  isOn: boolean
  onChange: (isOn: boolean) => void
  // setIsOn: React.Dispatch<React.SetStateAction<boolean>>
}

export function ToggleSwitch({ isOn, onChange }: ToggleSwitchProps) {
  return (
    <motion.div
      onClick={() => onChange(!isOn)}
      className={cn(
        'bg-brand flex h-8 w-14 items-center rounded-full px-[2px]',
        !isOn && 'bg-foreground/10',
      )}
      style={{
        justifyContent: !isOn ? 'flex-start' : 'flex-end',
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
