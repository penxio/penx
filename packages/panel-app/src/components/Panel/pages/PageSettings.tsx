import { Trans } from '@lingui/react/macro'
import { ProfileButton } from '@penx/components/ProfileButton'
import { SettingsContent } from '@penx/components/SettingsDialog/SettingsContent'
import { SettingsSidebar } from '@penx/components/SettingsDialog/SettingsSidebar'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { ActionPanel } from '../../../components/ExtensionApp/ActionPanel'
import { Action } from '../../../components/ExtensionApp/actions/Action'
import { DetailApp } from '../../../components/ExtensionApp/DetailApp'
import { PopButton } from '../../../components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '../../../hooks/useCurrentCommand'
import { navigation, useQueryNavigations } from '../../../hooks/useNavigation'

export function PageSettings() {
  const { current } = useQueryNavigations()
  const { currentCommand } = useCurrentCommand()

  console.log('=======current:', current)

  return (
    <DetailApp
      className=""
      bodyClassName="pl-[250px]"
      hideHeader
      hideFooter
      headerBordered={false}
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
          navigation.pop()
          appEmitter.emit('SUBMIT_QUICK_INPUT')
        },
      }}
    >
      <div className="fixed left-0 h-screen w-[250px] overflow-hidden">
        <SettingsSidebar className="min-h-screen overflow-auto p-4 pt-14" />
      </div>
      <PopButton className="fixed left-4 top-4" />
      <SettingsContent className="bg-background z-10 min-h-full px-6" />
    </DetailApp>
  )
}
