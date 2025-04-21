import { Trans } from '@lingui/react'
import { MySite } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { getUrl } from '@penx/utils'

interface Props {
  count: number
  sites: MySite[]
}
export function SiteCount({ count, sites }: Props) {
  return (
    <div className="flex items-center gap-2">
      {sites.slice(0, 5).map((site) => (
        <Avatar key={site.id} className="ring-background -ml-4 ring-2">
          <AvatarImage src={getUrl(site.logo!)} />
          <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ))}
      <div className="flex flex-col">
        <div className="inline-flex h-6 leading-none">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="icon-[material-symbols--star-rounded] -bottom-1 h-6 w-6 bg-yellow-500 leading-none"
              ></span>
            ))}
        </div>

        <div className="space-x-1">
          <span className="font-bold">{count}</span>
          <span className="text-sm">
            <Trans id="digital gardens created"></Trans>
          </span>
        </div>
      </div>
    </div>
  )
}
