'use client'

import { Image } from '@penx/components/Image'
import { Link } from '@penx/libs/i18n'
import { getUrl } from '@penx/utils'
import { RouterOutputs } from '@penx/api'

interface Props {
  area: RouterOutputs['area']['list']['0']
}

export function AreaItem({ area }: Props) {
  return (
    <Link
      href={`/~/areas/${area.id}`}
      key={area.id}
      className="bg-foreground/5 flex flex-col items-center gap-3 rounded-lg p-5"
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
      {/* <div className="mt-auto">
        <div className="flex justify-center gap-2">
          <Button variant="outline-solid">Setup payment</Button>
          <Button variant="outline-solid">Setup payment</Button>
        </div>
      </div> */}
    </Link>
  )
}
