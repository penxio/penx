import { Pagination } from '@/components/theme-ui/Pagination'
import { Creation, Site } from '@penx/types'
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
      <div className="grid grid-cols-1 gap-6">
        {displayPosts.map((post) => {
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
