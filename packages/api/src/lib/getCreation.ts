import { prisma } from '@penx/db'
import { CreationById } from '@penx/types'

export async function getCreation(id: string) {
  const creation = await prisma.creation.findUniqueOrThrow({
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
    where: { id },
  })
  return creation as CreationById
}
