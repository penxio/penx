import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { Separator } from '@penx/ui/components/separator'
import { DatabaseProvider } from './DatabaseProvider'
import { TableName } from './TableName'
import { ViewList } from './ViewNav/ViewList'
import { TableView } from './views/TableView/TableView'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  node: Node
}

export const InlineDatabase = ({ node }: Props) => {
  return null
}
