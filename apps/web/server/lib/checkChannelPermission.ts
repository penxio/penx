import { prisma } from '@penx/db'
import { Channel, Creation } from '@penx/db/client'
import { TRPCError } from '@trpc/server'

export async function checkChannelPermission(
  userId: string,
  channelId: string,
) {
  const channel = await prisma.channel.findUniqueOrThrow({
    where: { id: channelId },
    include: {
      site: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (channel.site.userId !== userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access resource',
    })
  }
}
