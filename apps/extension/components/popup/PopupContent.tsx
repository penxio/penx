import { useEffect } from 'react'
import { useSession } from '@/hooks/useSession'
import { ACTIONS, AppType, BACKGROUND_EVENTS, BASE_URL } from '@/lib/constants'
import { sendMessage } from '@/lib/message'
import { getUrl } from '@/lib/utils'
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
  const { appType, setAppType } = useAppType()

  useAreas()

  const initPopup = async () => {
    await chrome.runtime.sendMessage({
      type: BACKGROUND_EVENTS.INIT_POPUP,
      payload: {},
    })
  }

  useEffect(() => {
    initPopup()
  }, [])

  if (appType === AppType.BOOKMARK) {
    return <AddBookmark />
  }

  return (
    <div className="bg-background flex flex-1 flex-col justify-between gap-3 p-3">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="text-base font-bold">PenX</div>
          {session && (
            <Avatar className="h-7 w-7">
              <AvatarImage src={getUrl(session.image || '')} />
              <AvatarFallback>{session.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <Button
        onClick={async () => {
          const result = await sendMessage('prompt', {
            messages: [],
          })
          console.log('=======result:', result)
        }}
      >
        Hello world
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <FeatureEntry
          name="Add note"
          icon={Text}
          type={AppType.NOTE}
          // className="text-amber-600"
          onClick={async () => {
            const [tab] = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            })

            chrome.tabs.sendMessage(tab.id!, {
              type: ACTIONS.AreaSelect,
              payload: {
                action: AppType.NOTE,
              },
            })

            window.close()
          }}
        />
        <FeatureEntry
          name="Add bookmark"
          icon={BookmarkPlusIcon}
          type={AppType.BOOKMARK}
          // className="text-red-600"
          onClick={() => {
            setAppType(AppType.BOOKMARK)
          }}
        />
        <FeatureEntry
          name="Clip page..."
          icon={Scissors}
          type={AppType.CLIP_PAGE}
          // className="text-green-600"
          onClick={() => {
            toast.success('Coming soon!')
          }}
        />
        <FeatureEntry
          name="Write"
          icon={FeatherIcon}
          type={AppType.WRITE}
          // className="text-blue-600"
          onClick={() => {
            window.open(`${BASE_URL}/~`)
            window.close()
            return
          }}
        />
      </div>
    </div>
  )
}
