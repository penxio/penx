'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWindowSize } from 'usehooks-ts'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'
import { ArtifactKind } from './artifact'
import { UISuggestion } from './editor/suggestions'
import { CrossIcon, MessageIcon } from './icons'

export const Suggestion = ({
  suggestion,
  onApply,
  artifactKind,
}: {
  suggestion: UISuggestion
  onApply: () => void
  artifactKind: ArtifactKind
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { width: windowWidth } = useWindowSize()

  return (
    <AnimatePresence>
      {!isExpanded ? (
        <motion.div
          className={cn('text-muted-foreground cursor-pointer p-1', {
            'absolute -right-8': artifactKind === 'text',
            'sticky right-4 top-0': artifactKind === 'code',
          })}
          onClick={() => {
            setIsExpanded(true)
          }}
          whileHover={{ scale: 1.1 }}
        >
          <MessageIcon size={windowWidth && windowWidth < 768 ? 16 : 14} />
        </motion.div>
      ) : (
        <motion.div
          key={suggestion.id}
          className="bg-background absolute -right-12 z-50 flex w-56 flex-col gap-3 rounded-2xl border p-3 font-sans text-sm shadow-xl md:-right-16"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="bg-muted-foreground/25 size-4 rounded-full" />
              <div className="font-medium">Assistant</div>
            </div>
            <button
              type="button"
              className="cursor-pointer text-xs text-gray-500"
              onClick={() => {
                setIsExpanded(false)
              }}
            >
              <CrossIcon size={12} />
            </button>
          </div>
          <div>{suggestion.description}</div>
          <Button
            variant="outline"
            className="w-fit rounded-full px-3 py-1.5"
            onClick={onApply}
          >
            Apply
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
