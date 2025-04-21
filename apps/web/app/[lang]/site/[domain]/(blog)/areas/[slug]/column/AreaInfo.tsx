import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { Badge } from '@penx/uikit/ui/badge'
import { Link } from '@penx/libs/i18n'
import { AreaWithCreations } from '@penx/types'
import { getUrl } from '@penx/utils'
import { Trans } from '@lingui/react'

interface Props {
  area: AreaWithCreations
}
export function AreaInfo({ area }: Props) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src={getUrl(area.logo || '')} />
          <AvatarFallback>{area.name.slice(0, 1)}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <Link href={`/area/${area.slug}`} className="text-xl font-bold">
            {area.name}
          </Link>
        </div>
        <div className="text-foreground/60">{area.description}</div>
      </div>
    </div>
  )
}
