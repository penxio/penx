'use client'

import TextareaAutosize from 'react-textarea-autosize'
import { motion } from 'motion/react'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { cn } from '@penx/utils'

interface PostItemProps {
  creation: Creation
}

export function TaskItem({ creation: creation }: PostItemProps) {
  const completed = creation.checked
  return (
    <motion.div
      className={cn('')}
      // layout
      layoutId={creation.id}
      layout="position"
      transition={{ duration: 0.3 }}
      onClick={() => {
        store.panels.openTaskItem(creation.id)
      }}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          className="size-5"
          checked={completed}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(v) => {
            updateCreationProps(creation.id, {
              checked: v as any,
            })
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: completed ? 0.5 : 1,
            scale: completed ? 0.95 : 1,
            textDecoration: completed ? 'line-through' : 'none',
          }}
          transition={{ duration: 0.3 }}
          className={cn(creation.checked && 'text-foreground/60 line-through')}
        >
          {creation.title || ''}
        </motion.div>
      </div>
    </motion.div>
  )
}
