'use client'

import React from 'react'
import { convertTimeToSeconds } from '@/lib/utils'
import { cn } from '@udecode/cn'
import { SlateElement, type SlateElementProps } from '@udecode/plate'
import { TPodcastTimeElement } from '../custom-plate-plugins/podcast-time'

export function PodcastTimeElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  const element = props.element as TPodcastTimeElement

  if (element.point.length === 0) return null
  return (
    <SlateElement
      className={cn('inline-block select-none', className)}
      {...props}
    >
      <a
        href={`#t=${props.element.point || '00:00'}`}
        className="text-brand mr-1"
        onClick={(e) => {
          const href = e.currentTarget.getAttribute('href') || ''
          const player = window.__PLAYER__
          player.seek(convertTimeToSeconds(href?.replace('#t=', '')))
          if (player.audio.paused) {
            player.play()
          }
        }}
      >
        {element.point}
      </a>
      {children}
    </SlateElement>
  )
}
