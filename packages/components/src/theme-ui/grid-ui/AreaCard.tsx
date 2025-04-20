import { Image } from '@penx/components/Image'
import { Link } from '@penx/libs/i18n'
import { LayoutItem, Site } from '@penx/types'
import { getUrl } from '@penx/utils'

export function AreaCard({ item, site }: { item: LayoutItem; site: Site }) {
  const area = site.areas.find((s) => s.id === item.props?.areaId)

  if (!area) return null
  return (
    <Link
      href={`/areas/${area.slug}`}
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 p-4 transition-all hover:scale-105"
    >
      <Image
        width={100}
        height={100}
        alt=""
        src={getUrl(area.logo || '')}
        className="size-13"
      />
      <div className="text-base font-semibold">{area.name}</div>
      <div className="text-foreground/60 flex-1 px-4 text-center text-sm">
        {area.description}
      </div>
    </Link>
  )
}
