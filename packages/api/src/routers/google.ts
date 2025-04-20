import { REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL } from '@penx/constants'
import { prisma } from '@penx/db'
import { GoogleInfo } from '@penx/types'
import ky from 'ky'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const googleRouter = router({
  googleDriveToken: publicProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.token.uid

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user?.google) return null

    const googleInfo = user.google as GoogleInfo

    const isExpired = googleInfo.expiry_date < Date.now()

    console.log('=========isExpired:', isExpired)

    if (!isExpired) {
      return googleInfo
    }

    if (!googleInfo.refresh_token) return null

    try {
      const tokenInfo = await ky
        .get(
          REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL +
            `?refresh_token=${googleInfo.refresh_token}`,
        )
        .json<any>()

      await prisma.user.update({
        where: { id: userId },
        data: { google: tokenInfo },
      })
      return tokenInfo
    } catch (error) {
      console.log('error=============:', error)
      return null
    }
  }),

  disconnectGoogleDrive: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.user.update({
      where: { id: ctx.token.uid },
      data: { google: {} },
    })
  }),
})
