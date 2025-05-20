import { OptionTag } from '@penx/components/OptionTag'
import { Creation } from '@penx/domain'
import { ColumnType, StructType, Option } from '@penx/types'
import { mappedByKey } from '@penx/utils'
import { useDatabaseContext } from '../../DatabaseProvider'
import { CreationList } from '../ListView/CreationList'
import { TasksList } from '../ListView/Tasks/TasksList'

interface Tag {
  text: string
}

interface Props {}

export const ListView = ({}: Props) => {
  const { struct } = useDatabaseContext()

  if (struct.type === StructType.TASK) {
    return <TasksList struct={struct} />
  }

  return <CreationList struct={struct} />
}
