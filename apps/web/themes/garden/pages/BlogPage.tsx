import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Creation, Site } from '@/lib/theme.types'
import { Trans } from '@lingui/react/macro'
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
    <div className="mx-auto max-w-2xl">
      <PageTitle className="">
        <Trans>Writings</Trans>
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
