import { Trans } from '@lingui/react/macro'
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

  return (
    <DetailApp
      className=""
      hideFooter
      headerBordered={false}
      command={currentCommand}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <div>AI chat, Coming...</div>
      </div>
    </DetailApp>
  )
}
