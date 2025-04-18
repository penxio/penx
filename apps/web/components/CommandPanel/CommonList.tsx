import { SearchDatabaseList } from './SearchDatabaseList'
import { SearchPageList } from './SearchPageList'

interface Props {}

export function CommonList({}: Props) {
  return (
    <>
      <SearchPageList heading="Recent posts" isRecent />
      {/* <SearchDatabaseList heading="Recent databases" isRecent /> */}
    </>
  )
}
