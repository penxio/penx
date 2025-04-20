import { Image } from '@/components/Image'
import { Link } from '@/lib/i18n'
import { Site } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { Area } from '@prisma/client'

interface Props {
  site: Site
  className?: string
}

export function AreaPageWidget({ site, className }: Props) {
  return (
    <div className={cn('flex flex-col flex-wrap gap-8 md:flex-row', className)}>
      {site.areas.map((item) => (
        <AreaItem key={item.id} area={item} />
      ))}
    </div>
  )
}

export function AreaItem({ area }: { area: Area }) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      key={area.id}
      className="bg-foreground/5 flex w-full flex-1 flex-col items-center gap-3 rounded-lg p-5 transition-all hover:scale-105 md:max-w-[400px]"
    >
      <div className="flex justify-center">
        <Image
          width={200}
          height={200}
          src={getUrl(area.logo!)}
          alt=""
          className="size-20"
        />
      </div>
      <h2 className="text-lg font-semibold">{area.name}</h2>
      <div className="text-foreground/60 text-center">{area.description}</div>
    </Link>
  )
}
