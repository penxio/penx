import { prisma } from '@penx/db'
import { CreationStatus } from '@penx/db/client'
import { SiteCreation } from '@penx/types'

interface Opt {
  siteId?: string
  structId?: string
  areaId?: string
}
export async function findCreations(opt: Opt) {
  const creations = await prisma.creation.findMany({
    where: {
      ...opt,
      status: {
        not: CreationStatus.ARCHIVED,
      },
    },
    include: {
      struct: true,
      creationTags: { include: { tag: true } },
      user: {
        select: {
          displayName: true,
          image: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })

  const formatted = creations.map(({ content, ...rest }) => ({
    ...rest,
  }))
  return formatted as SiteCreation[]
}
