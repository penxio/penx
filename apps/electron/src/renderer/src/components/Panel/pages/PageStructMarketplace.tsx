import { Trans } from '@lingui/react/macro'
import { appEmitter } from '@penx/emitter'
import { useStructTemplates } from '@penx/hooks/useStructTemplates'
import { Logo } from '@penx/widgets/Logo'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { ListApp } from '~/components/ExtensionApp/ListApp'
import { ListItem } from '~/components/ExtensionApp/ListItem'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { navigation } from '~/hooks/useNavigation'
import { StructInfo } from '../CommandApp/DatabaseApp/StructInfo'

export function PageStructMarketplace() {
  const { currentCommand } = useCurrentCommand()
  const { data = [], isLoading } = useStructTemplates()

  return (
    <ListApp className="" hideFooter isLoading={isLoading} isDetailVisible>
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
          // actions={
          //   <ActionPanel>
          //     <Action.OpenInBrowser
          //       url={item.url}
          //       shortcut={{
          //         modifiers: ['cmd'],
          //         key: 'enter',
          //       }}
          //     />

          //     <Action.CopyToClipboard
          //       content={item.title}
          //       shortcut={{
          //         modifiers: ['cmd', 'shift'],
          //         key: 'enter',
          //       }}
          //     />
          //   </ActionPanel>
          // }
        />
      ))}
    </ListApp>
  )
}
