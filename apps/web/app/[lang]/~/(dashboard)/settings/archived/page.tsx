'use client'

import { PostList } from './PostList/PostList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div>
      <PostList />
    </div>
  )
}
