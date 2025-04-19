import { ReactNode } from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Footer } from '@/components/theme-ui/Footer'
import { IPFSLink } from '@/components/theme-ui/IPFSLink'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PaginationNav } from '@/components/theme-ui/PaginationNav'
import { PostActions } from '@/components/theme-ui/PostActions'
import { PostMetadata } from '@/components/theme-ui/PostMetadata'
import { PostSubtitle } from '@/components/theme-ui/PostSubtitle'
import { SubscribeNewsletterCard } from '@/components/theme-ui/SubscribeNewsletter/SubscribeNewsletterCard'
import { Toc } from '@/components/theme-ui/Toc'
import { Link } from '@/lib/i18n'
import { Creation, Site } from '@penx/types'
import { cn } from '@penx/utils'
import { ExternalLink } from 'lucide-react'

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
