import { CardStyle, GardenCardType, SocialType } from '@penx/constants'
import {
  Creation,
  StructType,
  Friend,
  LayoutItem,
  Project,
  Site,
} from '@penx/types'
import { cn } from '@penx/utils'
import { AreaCard } from './AreaCard'
import { ArticleCard } from './ArticleCard'
import { CommentsCard } from './CommentsCard'
import { FriendsCard } from './FriendsCard'
import { ImageCard } from './ImageCard'
import { PodcastCard } from './PodcastCard'
import { ProjectCard } from './ProjectCard'
import { SocialCard } from './SocialCard'
import { TextCard } from './TextCard'
import { TitleCard } from './TitleCard'

interface Props {
  site: Site
  creations: Creation[]
  podcasts: Creation[]
  projects: Project[]
  friends: Friend[]
}

export function GridLayoutUI({
  creations = [],
  projects = [],
  friends = [],
  podcasts = [],
  site,
}: Props) {
  const layout: LayoutItem[] = (site.theme.layout ?? []).map((item) => ({
    ...item,
    static: true,
  }))
  const margin = site.theme?.common?.margin ?? 30
  const containerWidth = site.theme?.common?.containerWidth || 900

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center',
        site.themeName === 'garden' && 'mt-16',
      )}
    >
      <style>
        {`

          @media only screen and (max-width: 800px) {
            .grid-layout-list {
              max-width: 100%;
            }
          }
          @media only screen and (min-width: 800px) {
            .grid-layout-list {
              width: ${containerWidth}px;
            }
          }

        `}
      </style>

      <div className="flex w-full flex-col gap-10">
        <div
          className="grid-layout-list row-auto mx-auto grid w-full grid-cols-4 md:grid-cols-8"
          style={{
            // gridTemplateRows: 'repeat(4, 1fr)',
            gap: margin,
          }}
        >
          {layout.map((item, index) => {
            const rowHeight = site.theme?.common?.rowHeight || 90
            const add = parseInt((item.h[1] / 4) as any) * margin

            const cardStyle = item?.cardStyle || CardStyle.SHADOW
            return (
              <div
                key={index}
                className={cn(
                  'group relative overflow-hidden rounded-xl',
                  `grid-layout-item-${index}`,
                  // item.type === GardenCardType.TITLE && item.y[1] > 0 && 'mt-8',
                  item.type === GardenCardType.TITLE &&
                    item.y[1] === 0 &&
                    '-mt-10',
                  item.type !== GardenCardType.TITLE && 'bg-background',
                  cardStyle === CardStyle.SHADOW &&
                    'ring-foreground/3 shadow ring-1',
                  cardStyle === CardStyle.BORDERED &&
                    'border-foreground/6 border',
                  cardStyle === CardStyle.UNSTYLED && 'bg-transparent',
                  item.type === GardenCardType.TITLE && 'shadow-none ring-0',
                )}
              >
                <style>
                  {`

                    @media only screen and (max-width: 800px) {
                      .grid-layout-item-${index} {
                        height: auto;
                        grid-row-start: ${item.y[0] + 1};
                        grid-column-start: ${item.x[0] + 1};
                        grid-row-end: ${item.y[0] + item.h[0] + 1};
                        grid-column-end: ${item.x[0] + item.w[0] + 1};
                      }
                    }
                    @media only screen and (min-width: 800px) {
                      .grid-layout-item-${index} {
                        height: ${rowHeight * item.h[1] + add}px;
                        grid-row-start: ${item.y[1] + 1};
                        grid-column-start: ${item.x[1] + 1};
                        grid-row-end: ${item.y[1] + item.h[1] + 1};
                        grid-column-end: ${item.x[1] + item.w[1] + 1};
                      }
                    }

                  `}
                </style>

                {item.type === GardenCardType.TITLE && (
                  <TitleCard item={item} />
                )}
                {item.type === GardenCardType.TEXT && <TextCard item={item} />}
                {item.type === StructType.IMAGE && <ImageCard item={item} />}
                {item.type === GardenCardType.AREA && (
                  <AreaCard item={item} site={site} />
                )}
                {item.type === StructType.ARTICLE && (
                  <ArticleCard site={site} creations={creations} item={item} />
                )}
                {item.type === StructType.AUDIO && (
                  <PodcastCard podcasts={podcasts} />
                )}

                {item.type === StructType.PROJECT && (
                  <ProjectCard item={item} projects={projects} />
                )}

                {item.type === GardenCardType.FRIENDS && (
                  <FriendsCard item={item} friends={friends} />
                )}

                {item.type === GardenCardType.COMMENTS && (
                  <CommentsCard item={item} />
                )}

                {Object.keys(SocialType).includes(item.type) && (
                  <SocialCard item={item} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
