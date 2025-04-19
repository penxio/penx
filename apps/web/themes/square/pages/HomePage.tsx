import { Button } from '@penx/uikit/ui/button'
import { Link } from '@/lib/i18n'
import { Creation, PostListStyle, Project, Site, Tag } from '@penx/types'
import { cn } from '@penx/utils'
import FeaturedPost from '../components/FeaturedPost'
import { PostItem } from '../components/PostItem'
import { Sidebar } from '../components/Sidebar'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  posts: Creation[]
  projects: Project[]
}

export function HomePage({ posts = [], site, about }: Props) {
  const { popularPosts, featuredPost, featuredPosts, commonPosts } =
    extractPosts(posts)

  const displayedPosts = commonPosts.slice(0, 100)
  return (
    <div className="mt-12 flex flex-col gap-10 md:flex-row">
      <div className="flex flex-1 flex-col gap-16">
        {featuredPost && <FeaturedPost creation={featuredPost} />}

        <div className="grid gap-4">
          {displayedPosts.map((post, index) => {
            return <PostItem key={post.slug} creation={post} />
          })}
        </div>
        <div className="flex justify-center">
          <Link
            href="/posts"
            className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
          >
            <Button variant="secondary">All posts &rarr;</Button>
          </Link>
        </div>
      </div>

      <Sidebar
        site={site}
        popularPosts={popularPosts}
        featuredPosts={featuredPosts}
        about={about}
      ></Sidebar>
    </div>
  )
}

function extractPosts(posts: Creation[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const featuredPosts = posts.filter(
    (post) => post.featured && post.id !== featuredPost.id,
  )
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    featuredPosts,
    commonPosts,
  }
}
