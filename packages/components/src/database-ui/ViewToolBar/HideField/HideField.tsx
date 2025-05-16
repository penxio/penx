'use client'

import React, { FC } from 'react'
import { Eye, EyeOff, HomeIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { useDatabaseContext } from '../../DatabaseProvider'
import { ToolbarBtn } from '../ToolbarBtn'
import { HideFieldOverlay } from './HideFieldOverlay'

export const HideField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null
  const { viewColumns = [] } = currentView
  const count = viewColumns.filter((i) => !i.visible).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarBtn isHighlight={!!count} icon={<EyeOff size={16} />}>
          {count > 0 && count} Hide Fields
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <HideFieldOverlay></HideFieldOverlay>
      </PopoverContent>
    </Popover>
  )
}
