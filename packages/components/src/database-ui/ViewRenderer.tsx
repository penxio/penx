import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { CreationType, ViewType } from '@penx/types'
import { useDatabaseContext } from './DatabaseProvider'
import { GalleryView } from './views/GalleryView/GalleryView'
import { NoteGalleryView } from './views/GalleryView/Notes/NoteGalleryView'
import { ListView } from './views/ListView/ListView'
import { TableView } from './views/TableView/TableView'

interface Props {}

export const ViewRenderer = ({}: Props) => {
  const { currentView, struct } = useDatabaseContext()

  if (currentView?.viewType === ViewType.GALLERY) {
    if (struct.type === CreationType.NOTE) {
      return <NoteGalleryView struct={struct} />
    }
    return <GalleryView />
  }

  if (currentView?.viewType === ViewType.LIST) {
    return <ListView />
  }

  return (
    <TableView
      height={`calc(100vh - ${WORKBENCH_NAV_HEIGHT + DATABASE_TOOLBAR_HEIGHT + 2}px)`}
    />
  )
}
