import { useEffect, useRef, useState } from 'react'
import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { StructType, ViewType } from '@penx/types'
import { useDatabaseContext } from './DatabaseProvider'
import { GalleryView } from './views/GalleryView/GalleryView'
import { NoteGalleryView } from './views/GalleryView/Notes/NoteGalleryView'
import { ListView } from './views/ListView/ListView'
import { TableView } from './views/TableView/TableView'

interface Props {}

export const ViewRenderer = ({}: Props) => {
  const { currentView, struct } = useDatabaseContext()

  if (currentView?.viewType === ViewType.GALLERY) {
    if (struct.type === StructType.NOTE) {
      return <NoteGalleryView struct={struct} />
    }
    return <GalleryView />
  }

  if (currentView?.viewType === ViewType.LIST) {
    return <ListView />
  }

  return (
    <WithWidth>
      {(width) => (
        <TableView
          width={width}
          height={`calc(100vh - ${WORKBENCH_NAV_HEIGHT + DATABASE_TOOLBAR_HEIGHT + 2}px)`}
        />
      )}
    </WithWidth>
  )
}

interface WithWidthProps {
  children: (h: number | string) => React.ReactNode
  className?: string
}

export const WithWidth: React.FC<WithWidthProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWith] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedWidth = entries[0].contentRect.width
        setWith(observedWidth)
      })

      resizeObserver.observe(containerRef.current)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return <div ref={containerRef}>{children(width)}</div>
}
