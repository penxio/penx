import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { appEmitter } from '@penx/emitter'
import { ActionPanel } from '../../../components/ExtensionApp/ActionPanel'
import { Action } from '../../../components/ExtensionApp/actions/Action'
import { DetailApp } from '../../../components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '../../../hooks/useCurrentCommand'
import { navigation } from '../../../hooks/useNavigation'

export function PageQuickInput() {
  const { currentCommand } = useCurrentCommand()
  return (
    <DetailApp
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
          alert('hlllo')
          appEmitter.emit('SUBMIT_QUICK_INPUT')
        },
      }}
    >
      <JournalQuickInput
        showFooter={false}
        className="max-h-auto shadow-0 prose:px-0  prose:mx-0 m-0 h-full w-full flex-1 rounded-none !bg-transparent"
        afterSubmit={() => {
          navigation.pop()
          toast.success(
            <div className="bg-background shadow-popover inline-flex rounded-lg px-3 py-2 text-sm">
              <Trans>Created successfully</Trans>
            </div>,
            {
              unstyled: true,
              className: 'inline-flex justify-center',
              position: 'bottom-center',
            },
          )
        }}
      />
    </DetailApp>
  )
}
