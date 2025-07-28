import { Chat } from '@penx/components/AIChat/chat'
import { RagSettingDialog } from '@penx/components/AIChat/rag-setting-dialog'
import { useSession } from '@penx/session'
import { uniqueId } from '@penx/unique-id'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useNavigation } from '~/hooks/useNavigation'

export function PageAIChat() {
  const { currentCommand } = useCurrentCommand()

  const { session } = useSession()

  return (
    <DetailApp
      className=""
      hideHeader
      hideFooter
      headerBordered={false}
      command={currentCommand}
    >
      <div className="flex h-full max-h-screen w-full flex-col">
        <div className="drag z-[10] flex w-full cursor-move items-center justify-between px-4 pt-4">
          <PopButton />
          <RagSettingDialog />
        </div>

        <div className="flex w-full flex-1 items-center justify-center p-3">
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
