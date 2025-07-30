import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { appEmitter } from '@penx/emitter'
import { ActionPanel } from '~/components/ExtensionApp/ActionPanel'
import { Action } from '~/components/ExtensionApp/actions/Action'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useNavigation } from '~/hooks/useNavigation'

export function PageCreateStruct() {
  const { pop } = useNavigation()
  const { currentCommand } = useCurrentCommand()
  return (
    <DetailApp
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


    </DetailApp>
  )
}
