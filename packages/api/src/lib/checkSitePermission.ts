import { prisma } from '@penx/db'
import { Site } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export async function checkSitePermission(
  userId: string,
  siteOrId: string | Site,
): Promise<void> {
  let site: Site
  if (typeof siteOrId === 'string') {
    site = await prisma.site.findUniqueOrThrow({
      where: { id: siteOrId },
    })
  } else {
    site = siteOrId
  }

  if (site.userId !== userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access this resource',
    })
  }
}
