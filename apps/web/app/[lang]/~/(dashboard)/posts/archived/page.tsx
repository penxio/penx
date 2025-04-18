import { CreationStatus } from '@/lib/constants'
import { PostList } from '../components/PostList'

export const dynamic = 'force-static'

export default function Page() {
  return <PostList status={CreationStatus.ARCHIVED} />
}
