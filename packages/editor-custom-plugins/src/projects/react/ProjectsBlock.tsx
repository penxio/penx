import { ArrowUpRight } from 'lucide-react'
import { Project } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'

interface Props {
  projects: Project[]
  className?: string
}

export function ProjectsBlock({ projects, className }: Props) {
  return (
    <section
      className={cn('grid-1 grid gap-x-14  gap-y-6 sm:grid-cols-2', className)}
    >
      {projects.map((item, index) => {
        return (
          <a
            key={index}
            href={item.url}
            target="_blank"
            className="hover:bg-foreground/8 -mx-4 flex justify-between gap-4 rounded-2xl px-4 py-4 transition-all hover:scale-105"
          >
            <Avatar className="h-24 w-24 rounded-none">
              <AvatarImage src={getUrl(item.icon || '')} />
              <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="space-y-3">
                <div className="flex-col gap-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <div className="text-foreground/60 leading-normal">
                    {item.introduction}
                  </div>
                </div>
              </div>
              {item.url && (
                <div className="text-foreground/50 flex items-center gap-0.5 text-sm">
                  <span className="hover:underline">
                    {new URL(item.url).host}
                  </span>
                  <ArrowUpRight size={12} className="text-foreground/60" />
                </div>
              )}
            </div>
          </a>
        )
      })}
    </section>
  )
}
