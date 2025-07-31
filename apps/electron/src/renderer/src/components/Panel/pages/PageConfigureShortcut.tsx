import { Trans } from '@lingui/react/macro'
import { BindHotkey } from '@penx/components/BindHotkey/ui/BindHotkey'
import { appEmitter } from '@penx/emitter'
import { ShortcutType } from '@penx/model-type'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { navigation } from '~/hooks/useNavigation'

export function PageConfigureShortcut() {
  const { currentCommand } = useCurrentCommand()
  console.log('========currentCommand:', currentCommand)

  return (
    <DetailApp
      className=""
      // hideFooter
      headerBordered={false}
      title={<Trans>Configure shortcut</Trans>}
      command={currentCommand}
      // actions={
      //   <ActionPanel>
      //     <Action.Item title={<Trans>Create</Trans>} />
      //   </ActionPanel>
      // }
      confirm={{
        // title: <Trans>Create</Trans>,
        shortcut: {
          modifiers: ['$mod'],
          key: 'enter',
        },
        onConfirm: () => {
          navigation.pop()
        },
      }}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <BindHotkey type={ShortcutType.COMMAND} commandId={currentCommand.id} />
      </div>
    </DetailApp>
  )
}
