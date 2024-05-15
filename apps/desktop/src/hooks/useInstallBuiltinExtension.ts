import { useQuery } from '@tanstack/react-query'
import { ListItem } from 'penx'
import { db } from '@penx/local-db'
import { uniqueId } from '@penx/unique-id'

const slug = '$penx_builtin_extension'

export function useInstallBuiltinExtension() {
  return useQuery(['builtin'], async () => {
    let ext = (await db.getExtensionBySlug(slug))!
    if (!ext) {
      const id = await db.createExtension({
        id: uniqueId(),
        spaceId: '',
        slug,
        name: 'PenX',
        version: '0.0.0',
        commands: [
          {
            name: 'clipboard-history',
            title: 'Clipboard history',
            icon: '/icons/copy.svg',
            subtitle: '',
            description: '',
            code: '',
            isBuiltIn: true,
          },
          {
            name: 'store',
            title: 'Store',
            icon: '/icons/store.svg',
            subtitle: '',
            description: '',
            code: '',
            isBuiltIn: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      ext = (await db.getExtension(id))!
    }

    // TODO:
    return ext.commands.map<ListItem>((item) => ({
      type: 'command',
      title: item.title,
      data: {
        commandName: item.name,
        extensionSlug: ext.slug,
        isBuiltIn: item.isBuiltIn!,
      },
    }))
  })
}
