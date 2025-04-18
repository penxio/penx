import { MouseEvent, TouchEvent } from 'react'

export function getDisableDragProps() {
  return {
    onMouseDown: (e: any) => {
      e.stopPropagation()
      e.preventDefault()
    },

    onTouchStart: (e: any) => {
      e.stopPropagation()
      e.preventDefault()
    },
  }
}
