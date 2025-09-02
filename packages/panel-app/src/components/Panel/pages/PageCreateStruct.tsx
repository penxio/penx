import { CreateStructForm } from '@penx/components/StructDialog/CreateStructForm'
import { appEmitter } from '@penx/emitter'
import { DetailApp } from '../../../components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '../../../hooks/useCurrentCommand'
import { useCurrentStruct } from '../../../hooks/useCurrentStruct'
import { navigation } from '../../../hooks/useNavigation'

export function PageCreateStruct() {
  const { setStruct } = useCurrentStruct()
  const { currentCommand } = useCurrentCommand()
  return (
    <DetailApp
      bodyClassName="flex items-center justify-center"
      headerBordered={false}
      title={currentCommand.title}
      hideFooter
      className=""
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
      //     pop()
      //     push({ path: '/edit-struct' })
      //     appEmitter.emit('SUBMIT_CREATE_STRUCT')
      //     appEmitter.emit('REFRESH_COMMANDS')
      //   },
      // }}
    >
      <div className="-mt-10 w-[360px]">
        <CreateStructForm
          onSubmitSuccess={(struct) => {
            navigation.replace({ path: '/edit-struct' })
            setStruct(struct)
            appEmitter.emit('REFRESH_COMMANDS')
          }}
        />
      </div>
    </DetailApp>
  )
}
