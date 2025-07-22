import { Trans } from '@lingui/react/macro'
import { ProfileButton } from '@penx/components/ProfileButton'
import { SettingsContent } from '@penx/components/SettingsDialog/SettingsContent'
import { SettingsSidebar } from '@penx/components/SettingsDialog/SettingsSidebar'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { Logo } from '@penx/widgets/Logo'
import { ActionPanel } from '~/components/ExtensionApp/ActionPanel'
import { Action } from '~/components/ExtensionApp/actions/Action'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useNavigation } from '~/hooks/useNavigation'

export function PageSettings() {
  const { pop } = useNavigation()
  const { currentCommand } = useCurrentCommand()

  return (
    <DetailApp
      className=""
      hideHeader
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
      <div className="relative flex h-full items-center justify-center">
        <PopButton className="absolute left-5 top-5" />
        <SettingsSidebar className="min-h-full pt-16" />
        <SettingsContent className="bg-background min-h-full" />
      </div>
    </DetailApp>
  )
}
