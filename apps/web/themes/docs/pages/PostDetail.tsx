import { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { Footer } from '@penx/components/Footer'
import { IPFSLink } from '@penx/components/IPFSLink'
import { PageTitle } from '@penx/components/PageTitle'
import { PaginationNav } from '@penx/components/PaginationNav'
import { PostActions } from '@penx/components/PostActions'
import { PostMetadata } from '@penx/components/PostMetadata'
import { PostSubtitle } from '@penx/components/PostSubtitle'
import { SubscribeNewsletterCard } from '@penx/components/SubscribeNewsletterCard'
import { Toc } from '@penx/components/Toc'
import { ContentRender } from '@penx/content-render'
import { Link } from '@penx/libs/i18n'
import { Creation, Site } from '@penx/types'
import { cn } from '@penx/utils'

interface LayoutProps {
  site: Site
  creation: Creation
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail({
  site,
  creation,
  next,
  prev,
  className,
}: LayoutProps) {
  return (
    <div
      className="flex gap-x-16 pt-4"
      style={
        {
          '--header-height': '80px',
        } as any
      }
    >
      <div className={cn('flex flex-1 flex-col', className)}>
        <div className="mb-auto flex-1">
          <header className="space-y-4 pb-4">
            <div className="mb-4">
              <PageTitle className="mb-2 mt-8">{creation.title}</PageTitle>
              {creation.description && (
                <PostSubtitle>{creation.description}</PostSubtitle>
              )}
            </div>
            <PostMetadata site={site} creation={creation} />
            <PostActions creation={creation} />
          </header>
          <div className="pt-2 md:pt-4">
            <div className="">
              <ContentRender content={creation.content} />
            </div>

            <IPFSLink cid={creation.cid} />

            <PaginationNav prev={prev} next={next} />
          </div>
        </div>
        <Footer className="mt-auto" site={site} />
      </div>

      <Toc
        content={creation.content}
        className="sticky top-20 hidden w-56 overflow-y-auto py-10 pl-6 xl:block"
        style={{
          height: 'calc(100vh - 4rem)',
        }}
      />
    </div>
  )
}
