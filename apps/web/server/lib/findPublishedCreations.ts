import { prisma } from '@penx/db'
import { CreationStatus } from '@penx/db/client'

export function findPublishedCreations(siteId: string) {
  return prisma.creation.findMany({
    where: { siteId, status: CreationStatus.PUBLISHED },
    include: {
      creationTags: { include: { tag: true } },
      user: {
        select: {
          displayName: true,
          image: true,
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })
}
