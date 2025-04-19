import { ProjectsBlock } from '@penx/uikit/editor/custom-plate-plugins/projects/react/ProjectsBlock'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { HOME_PROJECT_LIMIT, LATEST_POSTS_LIMIT } from '@penx/constants'
import { Link } from '@/lib/i18n'
import {
  Creation,
  PostListStyle,
  Project,
  Site,
  Tag as TagEntity,
} from '@penx/types'
import { cn, formatDate } from '@penx/utils'
import Image from 'next/image'
import { FeatureBox } from '../components/FeatureBox'
import { PostItem } from '../components/PostItem'
import Tag from '../components/Tag'
import { TagList } from '../components/TagList'
import { TagNav } from '../components/TagNav'

interface Props {
  about: any
  tags: TagEntity[]
  site: Site
  posts: Creation[]
  projects: Project[]
}

export function HomePage({ about, posts = [], projects, tags, site }: Props) {
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestCreations ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const showsFeatured = site.theme?.home?.showFeatured ?? false
  const postListStyle =
    site.theme?.common?.creationListStyle ?? PostListStyle.SIMPLE

  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const allPosts = posts.filter((post) => post.id !== featuredPost.id)

  return (
    <div className="mt-12 flex flex-col gap-24">
      {featuredPost && <FeatureBox creation={featuredPost} />}

      <div className="flex flex-col gap-6">
        <TagList tags={tags} />

        <div className="grid grid-cols-3 gap-x-8 gap-y-14">
          {allPosts.map((post) => {
            return <PostItem key={post.slug} creation={post} />
          })}
        </div>
      </div>
    </div>
  )
}
