'use client'

import { Image } from '@penx/components/Image'
import { Link } from '@penx/libs/i18n'
import { getUrl } from '@penx/utils'
import { Area } from '@prisma/client'

interface Props {

  area: Area
}

export function AreaItem({ area }: Props) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      key={area.id}
      className="bg-foreground/4 hover:bg-foreground/8 flex flex-col items-center gap-3 rounded-lg p-5 transition-all"
    >
      <div className="flex justify-center">
        <Image
          width={200}
          height={200}
          src={getUrl(area.logo!)}
          alt=""
          className="size-20 rounded-xl"
        />
      </div>
      <h2 className="text-lg font-semibold">{area.name}</h2>
      <div className="text-foreground/60 text-center">{area.description}</div>
    </Link>
  )
}
