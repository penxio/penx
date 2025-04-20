import { Image } from '@penx/components/Image'
import { Link } from '@penx/libs/i18n'
import { LayoutItem, Project, Site } from '@penx/types'
import { getUrl } from '@penx/utils'
import { ArrowUpRight } from 'lucide-react'

export function ProjectCard({
  item,
  projects,
}: {
  item: LayoutItem
  projects: Project[]
}) {
  const project = projects.find((s) => s.id === item?.props?.projectId)
  if (!project) return null

  return (
    <Link
      href={project.url}
      target="_blank"
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 p-4 transition-all hover:scale-105"
    >
      <Image
        width={100}
        height={100}
        alt=""
        src={getUrl(project.icon || '')}
        className="size-13"
      />
      <div className="text-base font-semibold">{project.name}</div>
      <div className="text-foreground/60 text-center text-sm">
        {project.introduction}
      </div>

      {project.url && (
        <div className="text-foreground/50 flex items-center gap-0.5 text-sm">
          <span className="hover:underline">{new URL(project.url).host}</span>
          <ArrowUpRight size={12} className="text-foreground/60" />
        </div>
      )}
    </Link>
  )
}
