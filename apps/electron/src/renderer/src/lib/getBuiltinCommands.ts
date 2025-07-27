import { t } from '@lingui/core/macro'
import { PageAIChat } from '~/components/Panel/pages/PageAIChat'
import { PageLogin } from '~/components/Panel/pages/PageLogin'
import { PageQuickInput } from '~/components/Panel/pages/PageQuickInput'
import { PageSettings } from '~/components/Panel/pages/PageSettings'
import { PageSync } from '~/components/Panel/pages/PageSync/PageSync'
import { ICommandItem } from '~/lib/types'
import { pinWindow } from './pinned'

export function getBuiltinCommands() {
  const commands: ICommandItem[] = [
    {
      id: 'quick-input',
      title: t`Quick input`,
      keywords: ['Quick', 'Input', 'Quick input'],
      icon: {
        name: 'lucide:pen-line',
        className: 'bg-linear-to-r from-cyan-500 to-blue-500',
      },
      data: {
        type: 'Command',
        component: PageQuickInput,
        afterOpen() {
          pinWindow()
        },
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'quick-input',
        extensionSlug: '',
        extensionIcon: '',
        isDeveloping: false,
        applicationPath: '',
        isApplication: false,
      },
    },
    {
      id: 'ai-chat',
      title: t`AI Chat`,
      keywords: ['ai', 'chat'],
      icon: {
        // name: 'solar:pen-bold',
        name: 'mingcute:ai-fill',
        className: 'bg-linear-to-r from-red-500 to-orange-500',
      },
      data: {
        type: 'Command',
        component: PageAIChat,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'ai-chat',
        extensionSlug: '',
        extensionIcon: '',
        isDeveloping: false,
        applicationPath: '',
        isApplication: false,
      },
    },
    {
      id: 'account',
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
      id: 'cloud-sync',
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
      id: 'settings',
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
