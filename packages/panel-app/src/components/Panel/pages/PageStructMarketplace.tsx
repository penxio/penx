import { useEffect } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { useStructs } from '@penx/hooks/useStructs'
import { useStructTemplates } from '@penx/hooks/useStructTemplates'
import { store } from '@penx/store'
import { ActionPanel } from '../../../components/ExtensionApp/ActionPanel'
import { Action } from '../../../components/ExtensionApp/actions/Action'
import { DetailApp } from '../../../components/ExtensionApp/DetailApp'
import { ListApp } from '../../../components/ExtensionApp/ListApp'
import { ListItem } from '../../../components/ExtensionApp/ListItem'
import { useCurrentCommand } from '../../../hooks/useCurrentCommand'
import { navigation } from '../../../hooks/useNavigation'
import { useValue } from '../../../hooks/useValue'
import { StructInfo } from '../CommandApp/DatabaseApp/StructInfo'

export function PageStructMarketplace() {
  const { currentCommand } = useCurrentCommand()
  const { data = [], isLoading, refetch } = useStructTemplates()
  const { structs } = useStructs()

  const { value, setValue } = useValue()
  useEffect(() => {
    if (!data?.length) return
    const find = data.find((i) => i.id === value)
    if (!find) setValue(data[0].id)
  }, [data])

  return (
    <ListApp
      className=""
      hideFooter
      isLoading={isLoading}
      isDetailVisible
      confirm={{
        title: <Trans>Install</Trans>,
        shortcut: {
          modifiers: ['$mod'],
          key: 'enter',
        },
        onConfirm: async () => {
          const item = data.find((d) => d.id === value)!
          const installed = structs.some((s) => s.type === item.type)
          if (installed) {
            return toast.success(t`Struct ${item.name} is installed!`)
          }

          store.structs.installStruct({
            name: item.name,
            pluralName: item.pluralName,
            columns: item.columns,
            description: item.description,
            type: item.type,
            color: item.color,
          })
          toast.success(t`Struct installed successfully!`)
          appEmitter.emit('REFRESH_COMMANDS')
          await api.installStruct(item.id)
          refetch()
        },
      }}
    >
      {data.map((item, index) => (
        <ListItem
          key={index}
          title={item.name}
          value={item.id}
          // subtitle={index}
          // icon={index}
          icon={{
            // name: 'tabler--brand-mysql',
            name: index + 1,
            className:
              'text-white bg-gradient-to-tl from-orange-500 to-yellow-500',
          }}
          detail={
            <div>
              <StructInfo struct={item as any} readonly />
            </div>
          }
          accessories={[
            {
              icon: { name: 'icon-[material-symbols--download]' },
              text: item.usedCount || 0,
            },
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                url={''}
                shortcut={{
                  modifiers: ['cmd'],
                  key: 'enter',
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </ListApp>
  )
}
