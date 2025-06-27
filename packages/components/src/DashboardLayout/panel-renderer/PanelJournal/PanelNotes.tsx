import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import './PanelNotes.css'
import { useCreations } from '@penx/hooks/useCreations'

const rows = new Array(10000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 100))

interface Props {
  height: number | string
  width: number | string
}

export function PanelNotes({ height, width }: Props) {
  const { creations } = useCreations()
  const notes = creations.filter((c) => c.isNote)

  console.log('=notes.len:====:', notes.length)

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    // count: rows.length,
    count: notes.length / 4,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rows[i],
    overscan: 5,
    lanes: 4,
  })

  // console.log(
  //   '======rowVirtualizer.getTotalSize():',
  //   rowVirtualizer.getTotalSize(),
  // )

  return (
    <>
      <div
        ref={parentRef}
        className="List bg-amber-200"
        style={{
          height: height,
          width: width,
          overflow: 'auto',
        }}
      >
        <div
          // className="bg-red-200"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            console.log('=====>>>>>virtualRow:', virtualRow)

            return (
              <div
                key={virtualRow.index}
                className={
                  virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                }
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${virtualRow.lane * 25}%`,
                  width: '25%',
                  height: `${rows[virtualRow.index]}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                Row {virtualRow.index}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
