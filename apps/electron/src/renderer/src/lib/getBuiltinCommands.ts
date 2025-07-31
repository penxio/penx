import { t } from '@lingui/core/macro'
import { PageAIChat } from '~/components/Panel/pages/PageAIChat'
import { PageCreateStruct } from '~/components/Panel/pages/PageCreateStruct'
import { PageLogin } from '~/components/Panel/pages/PageLogin'
import { PageQuickInput } from '~/components/Panel/pages/PageQuickInput'
import { PageSettings } from '~/components/Panel/pages/PageSettings'
import { PageStructMarketplace } from '~/components/Panel/pages/PageStructMarketplace'
import { PageSync } from '~/components/Panel/pages/PageSync/PageSync'
import { PageTranslate } from '~/components/Panel/pages/PageTranslate'
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
      id: 'create-struct',
      title: t`Create Struct`,
      keywords: ['create struct', 'struct', 'create'],
      icon: {
        name: 'tabler:braces',
        className: 'bg-linear-to-r from-green-500 to-blue-500',
      },
      data: {
        type: 'Command',
        component: PageCreateStruct,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'create-struct',
        extensionSlug: '',
        extensionIcon: '',
        isDeveloping: false,
        applicationPath: '',
        isApplication: false,
      },
    },

    // {
    //   id: 'create-quicklink',
    //   title: t`Create quicklink`,
    //   keywords: ['quicklink'],
    //   icon: {
    //     // name: 'solar:pen-bold',
    //     name: 'mingcute:ai-fill',
    //     className: 'bg-linear-to-r from-red-500 to-orange-500',
    //   },
    //   data: {
    //     type: 'Command',
    //     component: PageAIChat,
    //     alias: '',
    //     assets: {},
    //     filters: {},
    //     runtime: 'worker',
    //     commandName: 'ai-chat',
    //     extensionSlug: '',
    //     extensionIcon: '',
    //     isDeveloping: false,
    //     applicationPath: '',
    //     isApplication: false,
    //   },
    // },
    {
      id: 'struct-marketplace',
      title: t`Struct Marketplace`,
      keywords: ['marketplace'],
      icon: {
        name: 'mdi:marketplace',
        className: 'bg-linear-to-r from-rose-500 to-red-500',
      },
      data: {
        type: 'Command',
        component: PageStructMarketplace,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'struct-marketplace',
        extensionSlug: '',
        extensionIcon: '',
      },
    },
    {
      id: 'translate',
      title: t`Translate`,
      keywords: ['translate'],
      icon: {
        name: 'cuida:translate-outline',
        className: 'bg-sky-500',
      },
      data: {
        type: 'Command',
        component: PageTranslate,
        alias: '',
        assets: {},
        filters: {},
        runtime: 'worker',
        commandName: 'translate',
        extensionSlug: '',
        extensionIcon: '',
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
