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

export function PageLogin() {
  const { pop } = useNavigation()
  const { currentCommand } = useCurrentCommand()
  const { session } = useSession()
  console.log('=====session:', session)

  return (
    <DetailApp
      className=""
      hideFooter
      headerBordered={false}
      command={currentCommand}
      // actions={
      //   <ActionPanel>
      //     <Action.Item title={<Trans>Create</Trans>} />
      //   </ActionPanel>
      // }
      confirm={{
        title: <Trans>Create</Trans>,
        shortcut: {
          modifiers: ['$mod'],
          key: 'enter',
        },
        onConfirm: () => {
          pop()
          appEmitter.emit('SUBMIT_QUICK_INPUT')
        },
      }}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <div className="-mt-16 flex h-full flex-col items-center justify-center gap-3">
          <Logo className="shadow-popover rounded-2xl" />
          <div>
            <Trans>Sign in to PenX</Trans>
          </div>
          <ProfileButton></ProfileButton>
        </div>
      </div>
    </DetailApp>
  )
}
