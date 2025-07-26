'use client'

import Image from 'next/image'
import { NovelEditor } from '@penx/novel-editor/NovelEditor'
import { cn, getUrl } from '@penx/utils'
import { tiptapToMarkdown } from '@penx/utils/tiptapToMarkdown'

interface Props {
  content: any
  className?: string
}

export function ContentRender({ content, className }: Props) {
  console.log('==========content:', tiptapToMarkdown(content), content)

  if (typeof content === 'string' && content.startsWith('/')) {
    return (
      <div>
        <Image
          src={getUrl(content)}
          alt=""
          width={1000}
          height={1000}
          className="h-auto w-full rounded-lg"
        />
      </div>
    )
  }

  return <NovelEditor className={cn('px-3', className)} value={content} />
}
