'use client'

import { produce } from 'immer'
import { GardenCardType, SocialType } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { trpc } from '@penx/trpc-client'
import { StructType, LayoutItem } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { useThemeName } from '../hooks/useThemeName'
import { AreaCard } from './cards/AreaCard'
import { ArticleCard } from './cards/ArticleCard'
import { CommentsCard } from './cards/CommentsCard'
import { FriendsCard } from './cards/FriendsCard'
import { ImageCard } from './cards/ImageCard'
import { PodcastCard } from './cards/PodcastCard'
import { ProjectCard } from './cards/ProjectCard'
import { SocialCard } from './cards/SocialCard'
import { TextCard } from './cards/TextCard'
import { TitleCard } from './cards/TitleCard'
import { useDesignContext } from './hooks/DesignContext'

export function CardRender({ item }: { item: LayoutItem }) {
  const { layout, setLayout } = useDesignContext()

  if (item.type === GardenCardType.TITLE) {
    return <TitleCard layoutItem={item} layout={layout} setLayout={setLayout} />
  }

  if (item.type === GardenCardType.TEXT) {
    return <TextCard layoutItem={item} layout={layout} setLayout={setLayout} />
  }

  if (item.type === StructType.IMAGE) {
    return <ImageCard layoutItem={item} layout={layout} setLayout={setLayout} />
  }

  if (Object.keys(SocialType).includes(item.type)) {
    return <SocialCard layoutItem={item} layout={layout} />
  }

  if (item.type === StructType.ARTICLE) {
    return <ArticleCard />
  }

  if (item.type === StructType.AUDIO) {
    return <PodcastCard />
  }

  if (item.type === GardenCardType.COMMENTS) {
    return <CommentsCard />
  }

  if (item.type === GardenCardType.FRIENDS) {
    return <FriendsCard />
  }

  if (item.type === StructType.PROJECT) {
    return (
      <ProjectCard layoutItem={item} layout={layout} setLayout={setLayout} />
    )
  }

  if (item.type === GardenCardType.AREA) {
    return <AreaCard layoutItem={item} layout={layout} setLayout={setLayout} />
  }

  return null
}
