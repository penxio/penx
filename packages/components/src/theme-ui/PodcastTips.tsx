import { ExternalLink, PodcastIcon } from 'lucide-react'
import { Creation, CreationType } from '@penx/types'
import { cn, convertSecondsToTime } from '@penx/utils'

interface Props {
  className?: string
  creation: Creation
  showIcon?: boolean
}

export function PodcastTips({ creation, showIcon = true, className }: Props) {
  if (creation?.struct?.type !== CreationType.AUDIO) return null
  return (
    <div className="flex items-center gap-1">
      {showIcon && <PodcastIcon size={16} className="" />}
      {creation?.podcast?.duration && (
        <div className="border-foreground/10 rounded-full border  px-1 py-0.5 text-xs font-medium">
          {convertSecondsToTime(creation.podcast.duration)}
        </div>
      )}
    </div>
  )
}
