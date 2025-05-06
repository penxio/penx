import { SearchCreationList } from './SearchCreationList'
import { SearchDatabaseList } from './SearchDatabaseList'

interface Props {}

export function CommonList({}: Props) {
  return (
    <>
      <SearchCreationList isRecent />
      {/* <SearchDatabaseList heading="Recent databases" isRecent /> */}
    </>
  )
}
