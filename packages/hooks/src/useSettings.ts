import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { ISettingsNode, NodeType } from '@penx/model-type'
import { useSession } from '@penx/session'
import { uniqueId } from '@penx/unique-id'

export function useSettings() {
  const { session } = useSession()
  return useQuery({
    queryKey: ['settings', session.siteId],
    queryFn: async () => {
      let settings = await localDB.getSettings(session.siteId)
      if (!settings) {
        settings = await localDB.addNode<ISettingsNode>({
          id: uniqueId(),
          type: NodeType.SETTINGS,

          props: {
            syncServer: {
              url: '',
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: session.userId,
          siteId: session.siteId,
        })
      }
      return settings
    },
    enabled: !!session?.siteId,
  })
}
