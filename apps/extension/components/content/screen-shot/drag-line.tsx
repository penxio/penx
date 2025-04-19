import React, { useState } from 'react'
import * as styles from '../content.module.scss'

export type DragDirection = 'top' | 'bottom' | 'left' | 'right'

interface IDragLineProps {
  direction: DragDirection
  width: number
  height: number
  updatePosition: (
    event: React.DragEvent<HTMLDivElement>,
    resetPosition?: boolean,
  ) => void
  handleDragEnd: () => void
}

const DragLine = (props: IDragLineProps) => {
  const { direction, width, height, updatePosition } = props
  const [dragging, setDragging] = useState(false)

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setDragging(true)
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragging || !event.clientX || !event.clientY) return
    updatePosition(event, false)
  }

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    setDragging(false)
    updatePosition(event, true)
    props.handleDragEnd?.()
  }

  return (
    <>
      <div
        className={styles[`${direction}Line`]}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        onMouseDown={handleDragStart}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />
      {dragging && (
        <div
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          className={styles.dragBarMask}
          onMouseLeave={() => {
            setDragging(false)
            props.handleDragEnd?.()
          }}
        />
      )}
    </>
  )
}

export default React.memo(DragLine)
