import { ReactNode } from 'react'
import { Image } from '@/components/Image'
import { Creation, CreationType, Site } from '@penx/types'
import { cn } from '@penx/utils'
import { BackLinks } from './BackLinks'
import { ContentRender } from './ContentRender'
import { IPFSLink } from './IPFSLink'
import { PageTitle } from './PageTitle'
import { PaginationNav } from './PaginationNav'
import PodcastPlayer from './PodcastPlayer'
import { PostActions } from './PostActions'
import { PostMetadata } from './PostMetadata'
import { PostSubtitle } from './PostSubtitle'
import { SubscribeNewsletterCard } from './SubscribeNewsletter/SubscribeNewsletterCard'
import { Toc } from './Toc'

interface Props {
  site: Site
  creation: Creation
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  titleClassName?: string
}

export function PostPageWidget({
  site,
  creation,
  next,
  prev,
  className,
  titleClassName,
}: Props) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className={cn('mt-8 flex flex-1 flex-col', className)}>
        <div className="mb-auto flex-1">
          <header className="space-y-4 pb-4 ">
            <div className="mb-20">
              <PageTitle
                className={cn('mb-2 mt-0 text-center', titleClassName)}
              >
                {creation.title}
              </PageTitle>
              {creation.description && (
                <PostSubtitle className="text-center">
                  {creation.description}
                </PostSubtitle>
              )}
            </div>
            <PostMetadata site={site} creation={creation} />
            <PostActions creation={creation} />
          </header>

          {!!creation.image && (
            <Image
              src={creation.image || ''}
              alt=""
              width={1000}
              height={800}
              className="max-h-96 w-full rounded-2xl object-cover"
            />
          )}

          <div className="pt-2 md:pt-4">
            <div className="flex flex-col gap-4">
              {creation.type === CreationType.AUDIO && (
                <div className="mb-2 flex h-[130px] items-center">
                  <PodcastPlayer creation={creation} />
                </div>
              )}
              <ContentRender content={creation.content} />
              <SubscribeNewsletterCard site={site} />
            </div>

            <IPFSLink cid={creation.cid} />
            <PaginationNav prev={prev} next={next} />
          </div>
        </div>
      </div>
      <aside
        className="fixed bottom-0 top-0 -mt-32 hidden w-56 flex-col justify-center pr-10 lg:flex"
        style={{
          left: 'calc(100vw - 200px)',
        }}
      >
        <div className="flex flex-col gap-y-10">
          <Toc content={creation.content} className="" />
          <BackLinks />
        </div>
      </aside>
    </div>
  )
}
