import { Trans } from '@lingui/react/macro'
import { Chat } from '@penx/components/AIChat/chat'
import { ProfileButton } from '@penx/components/ProfileButton'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { Logo } from '@penx/widgets/Logo'
import { ActionPanel } from '~/components/ExtensionApp/ActionPanel'
import { Action } from '~/components/ExtensionApp/actions/Action'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
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
      hideFooter
      headerBordered={false}
      command={currentCommand}
    >
      <div className="flex h-full w-full items-center justify-center p-3">
        <Chat
          id="ai-chat"
          initialMessages={[]}
          isReadonly={false}
          session={session}
        />
      </div>
    </DetailApp>
  )
}
