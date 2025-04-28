import { Button } from '@penx/uikit/button'
import { Link } from '@penx/libs/i18n'
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
  const { popularPosts, featuredPost, commonPosts } = extractPosts(posts)

  const displayedPosts = commonPosts.slice(0, 100)
  return (
    <div className="mt-12 flex flex-col gap-20 md:flex-row">
      <div className="flex-1">
        {featuredPost && <FeaturedPost creation={featuredPost} />}

        <div className="grid gap-2">
          {displayedPosts.map((post, index) => {
            return (
              <PostItem
                key={post.slug}
                creation={post}
                className={cn(
                  displayedPosts.length - 1 !== index &&
                    'border-foreground/10 border-b',
                )}
              />
            )
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

      <Sidebar site={site} posts={popularPosts} about={about}></Sidebar>
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
