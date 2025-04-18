import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { ViewType } from '@/lib/types'
import { useDatabaseContext } from './DatabaseProvider'
import { GalleryView } from './views/GalleryView'
import { TableView } from './views/TableView/TableView'

interface Props {}

export const ViewRenderer = ({}: Props) => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  if (currentView.viewType === ViewType.GALLERY) {
    return <GalleryView />
  }

  return (
    <TableView
      height={`calc(100vh - ${WORKBENCH_NAV_HEIGHT + DATABASE_TOOLBAR_HEIGHT + 2}px)`}
    />
  )
}
