import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { ISettingsNode, NodeType } from '@penx/model-type'
import { useSession } from '@penx/session'
import { uniqueId } from '@penx/unique-id'

export function useSettings() {
  const { session } = useSession()
  return useQuery({
    queryKey: ['settings', session.spaceId],
    queryFn: async () => {
      let settings = await localDB.getSettings(session.spaceId)
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
          spaceId: session.spaceId,
        })
      }
      return settings
    },
    enabled: !!session?.spaceId,
  })
}
