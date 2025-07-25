import { Chat } from '@penx/components/AIChat/chat'
import { RefreshChatButton } from '@penx/components/AIChat/refresh-chat-button'
import { useSession } from '@penx/session'
import { uniqueId } from '@penx/unique-id'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useNavigation } from '~/hooks/useNavigation'

export function PageAIChat() {
  const { pop } = useNavigation()
  const { currentCommand } = useCurrentCommand()

  const { session } = useSession()
  console.log('======session:', session)

  return (
    <DetailApp
      className=""
      hideHeader
      hideFooter
      headerBordered={false}
      command={currentCommand}
    >
      <div className="flex h-full w-full flex-col">
        <div className="drag z-[10] flex w-full cursor-move items-center justify-between px-4 pt-4">
          <PopButton />
          <RefreshChatButton />
        </div>

        <div className="flex h-full w-full items-center justify-center p-3">
          <Chat
            id={uniqueId()}
            initialMessages={[]}
            isReadonly={false}
            session={session}
          />
        </div>
      </div>
    </DetailApp>
  )
}
