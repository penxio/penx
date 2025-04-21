import { Trans } from '@lingui/react'
import { PageTitle } from '@penx/components/theme-ui/PageTitle'
import { Creation, Site } from '@penx/types'
import { PostList } from '../components/PostList'

interface Props {
  site: Site
  posts: Creation[]
  initialDisplayCreations: Creation[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export function BlogPage({
  site,
  posts = [],
  pagination,
  initialDisplayCreations,
}: Props) {
  return (
    <div className="space-y-6">
      <PageTitle>
        <Trans id="Writings"></Trans>
      </PageTitle>
      <PostList
        site={site}
        posts={posts}
        pagination={pagination}
        initialDisplayCreations={initialDisplayCreations}
      />
    </div>
  )
}
