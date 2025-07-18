'use client'

import { useMemo } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { isMobileApp } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { Panel, StructType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { cn } from '@penx/utils'
import { ChangeType } from './ChangeType'
import { usePanelCreationContext } from './PanelCreationProvider'
import { Tags } from './Tags'

interface Props {
  canChangeType?: boolean
  showDescription?: boolean
  className?: string
}

export function CreationHeader({
  canChangeType = true,
  showDescription = false,
  className,
}: Props) {
  const creation = usePanelCreationContext()
  const { structs } = useStructs()

  const struct = structs.find((m) => m.id === creation.structId)

  const hideTitle = useMemo(() => {
    if (struct?.type === StructType.NOTE) {
      return true
    }
    return false
  }, [struct])

  return (
    <div>
      {!hideTitle && (
        <div className="mb-2 flex flex-col space-y-3 md:mb-5">
          <div className="relative">
            {/* {!isImage && !isMobileApp && (
                  <CoverUpload
                    creation={creation}
                    isCover={isCover}
                    onCoverUpdated={async (uri) => {
                      updateCreationProps(creation.id, {
                        image: uri,
                      })
                    }}
                  />
                )} */}
            <div className="flex gap-2">
              {struct?.type === StructType.TASK && (
                <Checkbox
                  className={cn(
                    'border-foreground mt-[6px] size-5',
                    !isMobileApp && 'mt-3',
                  )}
                  checked={creation.checked}
                  onCheckedChange={(v) => {
                    updateCreationProps(creation.id, {
                      checked: v as any,
                    })
                  }}
                />
              )}

              <TextareaAutosize
                className="dark:placeholder-text-600 text-foreground placeholder:text-foreground/40 w-full resize-none border-none bg-transparent px-0 text-2xl font-bold focus:outline-none focus:ring-0 md:text-4xl"
                placeholder="Title"
                defaultValue={creation.title || ''}
                // autoFocus={!isMobileApp}
                // autoFocus
                onChange={(e) => {
                  const title = e.target.value
                  updateCreationProps(creation.id, { title })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    appEmitter.emit('FOCUS_EDITOR')
                    e.preventDefault()
                  }
                }}
              />
            </div>
          </div>

          {showDescription && (
            <TextareaAutosize
              className="dark:placeholder-text-600 w-full resize-none border-none bg-transparent px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0"
              placeholder="Remark"
              defaultValue={creation.description}
              onChange={(e) => {
                updateCreationProps(creation.id, {
                  description: e.target.value,
                })
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
            />
          )}
        </div>
      )}

      {canChangeType && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ChangeType creation={creation} />
            <div className="text-foreground/60 text-lg">•</div>
            <div className="flex items-center gap-2">
              <Tags creation={creation} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
