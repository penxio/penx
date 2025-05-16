import { slug } from 'github-slugger'
import { HOME_PROJECT_LIMIT, LATEST_POSTS_LIMIT } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import { ProjectsBlock } from '@penx/editor-custom-plugins/projects/react/ProjectsBlock'
import { Link } from '@penx/libs/i18n'
import { Creation, PostListStyle, Project, Site, Tag } from '@penx/types'
import { PostItem } from '../components/PostItem'
import { FeaturedCard } from './FeaturedCard'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  creations: Creation[]
  projects: Project[]
}

export function HomePage({
  about,
  creations = [],
  projects,
  tags,
  site,
}: Props) {
  const { popularPosts, featuredPosts } = extractPosts(creations)
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestCreations ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const showsFeatured = site.theme?.home?.showFeatured ?? false
  const postListStyle =
    site.theme?.common?.creationListStyle ?? PostListStyle.SIMPLE
  return (
    <div className="flex flex-col gap-16">
      {showAbout && <ContentRender content={about.content} />}

      {showsFeatured && <FeaturedCard creations={featuredPosts} />}

      {tags.length > 0 && (
        <div className="space-y-6">
          <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
            Tags
          </h1>

          <ul className="flex flex-wrap gap-x-5">
            {tags.map((t) => {
              return (
                <li key={t.id} className="">
                  <Link
                    href={`/tags/${slug(t.name)}`}
                    className="text-foreground/80 hover:text-brand dark:hover:text-brand rounded-full font-medium"
                    aria-label={`View posts tagged ${t.name}`}
                  >
                    #{`${t.name}`}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {showLatestPosts && (
        <div className="">
          <div className="flex items-center justify-between pb-6">
            <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
              Latest
            </h1>

            <Link
              href="/posts"
              className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
            >
              All posts &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {creations.slice(0, LATEST_POSTS_LIMIT).map((post) => {
              return <PostItem key={post.slug} creation={post} />
            })}
          </div>
        </div>
      )}

      {showProjects && projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between pb-6 pt-6">
            <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
              Projects
            </h1>

            {projects.length > HOME_PROJECT_LIMIT && (
              <Link
                href="/projects"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                All projects &rarr;
              </Link>
            )}
          </div>
          <ProjectsBlock projects={projects.slice(0, HOME_PROJECT_LIMIT)} />
        </div>
      )}
    </div>
  )
}

function extractPosts(creations: Creation[]) {
  const popularPosts = creations.filter((post) => post.isPopular)
  const featuredPosts = creations.filter((post) => post.featured)
  const ids = popularPosts.map((post) => post.id)
  const commonPosts = creations.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPosts,
    commonPosts,
  }
}
