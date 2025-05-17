import { prisma } from '@penx/db'
import { CreationStatus } from '@penx/db/client'

interface Opt {
  structId: string
  areaId: string
}
export function findNotes(opt: Opt) {
  return prisma.creation.findMany({
    where: {
      ...opt,
      status: {
        not: CreationStatus.ARCHIVED,
      },
    },
    include: {
      struct: true,
      creationTags: { include: { tag: true } },
      authors: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              displayName: true,
              ensName: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })
}
