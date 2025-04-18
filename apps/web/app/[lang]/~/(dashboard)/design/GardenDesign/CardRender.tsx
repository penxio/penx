'use client'

import { useSiteContext } from '@/components/SiteContext'
import { useSite } from '@/hooks/useSite'
import { GardenCardType, SocialType } from '@/lib/constants'
import { CreationType, LayoutItem } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { uniqueId } from '@/lib/unique-id'
import { produce } from 'immer'
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

  if (item.type === CreationType.IMAGE) {
    return <ImageCard layoutItem={item} layout={layout} setLayout={setLayout} />
  }

  if (Object.keys(SocialType).includes(item.type)) {
    return <SocialCard layoutItem={item} layout={layout} />
  }

  if (item.type === CreationType.ARTICLE) {
    return <ArticleCard />
  }

  if (item.type === CreationType.AUDIO) {
    return <PodcastCard />
  }

  if (item.type === GardenCardType.COMMENTS) {
    return <CommentsCard />
  }

  if (item.type === GardenCardType.FRIENDS) {
    return <FriendsCard />
  }

  if (item.type === CreationType.PROJECT) {
    return (
      <ProjectCard layoutItem={item} layout={layout} setLayout={setLayout} />
    )
  }

  if (item.type === GardenCardType.AREA) {
    return <AreaCard layoutItem={item} layout={layout} setLayout={setLayout} />
  }

  return null
}
