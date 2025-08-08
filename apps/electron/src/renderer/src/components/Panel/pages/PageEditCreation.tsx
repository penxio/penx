import { useMemo } from 'react'
import { Creation } from '@penx/components/Creation/Creation'
import { PanelCreationProvider } from '@penx/components/Creation/PanelCreationProvider'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentCreation } from '~/hooks/useCurrentCreation'
import { CommandList } from '../CommandComponents'

export function PageEditCreation() {
  const { creation } = useCurrentCreation()
  const { currentCommand } = useCurrentCommand()
  const creationId = useMemo(() => {
    if (creation) return creation.id

    if (currentCommand?.data?.creation) {
      return currentCommand.data.creation.id
    }
  }, [creation, currentCommand])

  console.log(
    '======creationId:',
    creationId,
    'currentCommand:',
    currentCommand,
  )

  if (!creationId) return null

  return (
    <DetailApp
      className=" bg-white/65 dark:bg-neutral-900/80"
      headerBordered={false}
      // actions={
      //   <ActionPanel>
      //     <Action.Item title={<Trans>Create</Trans>} />
      //   </ActionPanel>
      // }
      // confirm={{
      //   title: <Trans>Create</Trans>,
      //   shortcut: {
      //     modifiers: ['$mod'],
      //     key: 'enter',
      //   },
      //   onConfirm: () => {
      //     navigation.pop()
      //     appEmitter.emit('SUBMIT_QUICK_INPUT')
      //   },
      // }}
    >
      <PanelCreationProvider creationId={creationId}>
        <Creation className="pt-4" />
      </PanelCreationProvider>
    </DetailApp>
  )
}
