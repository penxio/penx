import { Pagination } from '@penx/components/theme-ui/Pagination'
import { Creation, Site } from '@penx/types'
import { cn } from '@penx/utils'
import { PostItem } from './PostItem'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListProps {
  site: Site
  creations: Creation[]
  initialDisplayCreations?: Creation[]
  pagination?: PaginationProps
}

export function PostList({
  creations,
  initialDisplayCreations = [],
  pagination,
}: PostListProps) {
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : creations

  return (
    <div className="">
      <div className="grid gap-2">
        {displayPosts.map((post, index) => {
          return <PostItem key={post.slug} creation={post} />
        })}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  )
}
