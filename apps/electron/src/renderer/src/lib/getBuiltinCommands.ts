import { t } from '@lingui/core/macro'
import { PageLogin } from '~/components/Panel/pages/PageLogin'
import { PageSettings } from '~/components/Panel/pages/PageSettings'
import { PageSync } from '~/components/Panel/pages/PageSync/PageSync'
import { ICommandItem } from '~/lib/types'

export function getBuiltinCommands() {
  const commands: ICommandItem[] = [
    {
      title: t`PenX Account`,
      keywords: ['account'],
      icon: {
        name: 'lucide:pen-line',
        className: 'bg-linear-to-r from-cyan-500 to-blue-500',
      },
      data: {
        type: 'Command',
        component: PageLogin,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'account',
        extensionSlug: '',
        extensionIcon: '',
      },
    },
    {
      title: t`Cloud sync`,
      keywords: ['sync'],
      icon: {
        name: 'mdi:cloud-sync',
        className: 'bg-linear-to-r from-purple-500 to-fuchsia-500',
      },
      data: {
        type: 'Command',
        component: PageSync,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'cloud-sync',
        extensionSlug: '',
        extensionIcon: '',
      },
    },
    {
      title: t`Settings`,
      keywords: ['Settings'],
      icon: {
        name: 'lucide:pen-line',
        className: 'bg-linear-to-r from-cyan-500 to-blue-500',
      },
      data: {
        type: 'Command',
        component: PageSettings,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'settings',
        extensionSlug: '',
        extensionIcon: '',
      },
    },
  ]

  return commands
}
