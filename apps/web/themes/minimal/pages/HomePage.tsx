import { ProjectsBlock } from '@penx/editor-custom-plugins'
import { ContentRender } from '@penx/content-render'
import { PageTitle } from '@penx/components/theme-ui/PageTitle'
import { HOME_PROJECT_LIMIT, LATEST_POSTS_LIMIT } from '@penx/constants'
import { Link } from '@penx/libs/i18n'
import { Creation, PostListStyle, Project, Site } from '@penx/types'
import { Trans } from '@lingui/react'
import { PostItem } from '../components/PostItem'

interface Props {
  about: any
  site: Site
  posts: Creation[]
  projects: Project[]
}

export function HomePage({ posts = [], site, projects, about }: Props) {
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestCreations ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const postListStyle =
    site.theme?.common?.creationListStyle ?? PostListStyle.SIMPLE
  return (
    <div className="flex flex-col gap-16">
      {showAbout && <ContentRender content={about.content} />}

      {showLatestPosts && (
        <section className="">
          <div className="flex items-center justify-between pb-6 pt-6">
            <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-3xl">
              Latest
            </h1>

            {posts.length > LATEST_POSTS_LIMIT && (
              <Link
                href="/posts"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                All posts &rarr;
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {!posts.length && <Trans id="No posts found."></Trans>}
            {posts.slice(0, LATEST_POSTS_LIMIT).map((post) => {
              return <PostItem key={post.slug} creation={post} />
            })}
          </div>
        </section>
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
