import { prisma } from '@penx/db'
import { Creation } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export async function checkPostPermission(
  userId: string,
  creationOrId: string | Creation,
) {
  let creation: Creation
  if (typeof creationOrId === 'string') {
    creation = await prisma.creation.findUniqueOrThrow({
      where: { id: creationOrId },
    })
  } else {
    creation = creationOrId
  }

  if (creation.userId !== userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access resource',
    })
  }
}
