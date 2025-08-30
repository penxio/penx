import { useSession } from '@/hooks/useSession'
import { ACTIONS, AppType, BACKGROUND_EVENTS, BASE_URL } from '@/lib/constants'
import { getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import {
  ArrowLeft,
  BookmarkPlusIcon,
  FeatherIcon,
  Monitor,
  Scissors,
  Text,
  Volume2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAreas } from '@penx/hooks/useAreas'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/ui/button'
import { AddBookmark } from '../content/AddBookmark/AddBookmark'
import { useAppType } from '../content/hooks/useAppType'
import { FeatureEntry } from './FeatureEntry'

export function PopupContent() {
  const { session } = useSession()

  return (
    <div className="bg-background flex flex-1 flex-col justify-between gap-3 p-3">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="text-base font-bold">PenX</div>
          {session && (
            <Avatar
              className="h-7 w-7 cursor-pointer"
              onClick={() => {
                window.open('https://penx.io/account')
              }}
            >
              <AvatarImage src={getUrl(session.image || '')} />
              <AvatarFallback>{session.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      <div>
        <Button
          className="w-full"
          onClick={() => {
            fetch('http://localhost:14158/open-window')
          }}
        >
          <Trans>Open PenX Desktop</Trans>
        </Button>
      </div>
    </div>
  )
}
