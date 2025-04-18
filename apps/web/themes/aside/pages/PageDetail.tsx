import { ReactNode } from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'

interface LayoutProps {
  page: any
  content: any
  children: ReactNode
  className?: string
}

export function PageDetail({ content, className }: LayoutProps) {
  return (
    <article className="mx-auto mt-10 w-full sm:mt-20 lg:max-w-3xl">
      <div className="">
        <ContentRender content={content} />
      </div>
    </article>
  )
}
