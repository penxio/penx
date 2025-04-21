import { ContentRender } from '@penx/content-render'
import { PageTitle } from '@penx/components/theme-ui/PageTitle'
import { LATEST_POSTS_LIMIT } from '@penx/constants'
import { Creation, Site } from '@penx/types'
import { Trans } from '@lingui/react/macro'
import { PostItem } from '../components/PostItem'

interface Props {
  about: any
  site: Site
  posts: Creation[]
}

export function HomePage({ posts = [], site, about }: Props) {
  const { popularPosts, featuredPost, commonPosts } = extractPosts(posts)
  return (
    <div className="mx-auto mb-20 max-w-3xl">
      <ContentRender content={about.content} />

      <div className="">
        <div className="flex items-center justify-between pb-6 pt-6">
          <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
            <Trans>Latest</Trans>
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {!posts.length && <Trans>No posts found.</Trans>}
          {posts.slice(0, LATEST_POSTS_LIMIT).map((post) => {
            return <PostItem key={post.slug} creation={post} />
          })}
        </div>
      </div>

      {popularPosts.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between pb-6 pt-6">
            <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
              <Trans>Most Popular</Trans>
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {popularPosts.slice(0, LATEST_POSTS_LIMIT).map((post) => {
              return <PostItem key={post.slug} creation={post} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function extractPosts(posts: Creation[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    commonPosts,
  }
}
