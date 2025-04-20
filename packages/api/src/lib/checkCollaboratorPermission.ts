import { prisma } from '@penx/db'
import { CollaboratorRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export async function checkCollaboratorPermission(
  userId: string,
  siteId: string,
): Promise<void> {
  const collaborator = await prisma.collaborator.findFirst({
    where: { userId, siteId },
  })

  const roles = [
    CollaboratorRole.ADMIN,
    CollaboratorRole.OWNER,
    CollaboratorRole.WRITE,
  ] as CollaboratorRole[]

  if (!collaborator || !roles.includes(collaborator.role)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access this resource',
    })
  }
}
