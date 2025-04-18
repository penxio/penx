import { PostList } from './PostList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-3">
      <PostList />
    </div>
  )
}
