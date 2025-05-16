'use client'

import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { STATIC_URL } from '@penx/constants'
import { trpc } from '@penx/trpc-client'

export function ThemeList() {
  const { data = [], isLoading } = trpc.theme.all.useQuery()
  if (isLoading) return <div></div>
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((item) => {
        const manifest = JSON.parse(item.manifest)

        return (
          <article
            key={item.id}
            className="bg-background border-foreground/5 flex  flex-col space-y-5 overflow-hidden rounded-lg border shadow-sm transition-all hover:scale-105"
          >
            <div className="border-b-popover-foreground/10 h-52 w-full border-b">
              <Image
                src={`${STATIC_URL}/${manifest.screenshots[0]}`}
                alt=""
                width={400}
                height={400}
                className="h-52 w-full object-cover"
              />
            </div>
            <div className="space-y-2 p-4">
              <div className="text-foreground/50 text-xs">
                Install theme: npx penx theme install {item.name}
              </div>
              <h2 className="text-xl font-semibold">
                {manifest.title || manifest.name}
              </h2>
              <div className="flex items-center justify-between text-sm">
                {manifest.author && <div>By {manifest.author}</div>}
                {manifest.previewUrl && (
                  <a
                    href={manifest.previewUrl}
                    target="_blank"
                    className="text-foreground/60 flex items-center gap-1"
                  >
                    <div>Preview</div>
                    <ExternalLink size={16}></ExternalLink>
                  </a>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
