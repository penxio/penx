import { cacheHelper } from '@penx/libs/cache-header'
import { prisma } from '@penx/db'
import { GithubInfo } from '@/lib/types'
import { components } from '@octokit/openapi-types'
import { Octokit } from 'octokit'
import { z } from 'zod'
import { getTokenByInstallationId } from '../lib/getTokenByInstallationId'
import { refreshGitHubToken } from '../lib/refreshGitHubToken'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const githubRouter = router({
  githubInfo: protectedProcedure.query(async ({ ctx, input }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.token.uid },
    })

    const github = (user?.github || {}) as GithubInfo

    if (!github.token || !github.refreshToken) return github

    const tokenExpiresAt = new Date(github.tokenExpiresAt!).valueOf()
    const isTokenExpired = Date.now() > tokenExpiresAt

    // accessToken not expired, use it
    if (!isTokenExpired) return github

    const refreshTokenExpiresAt = new Date(
      github.refreshTokenExpiresAt!,
    ).valueOf()

    const isRefreshTokenExpired = Date.now() > refreshTokenExpiresAt

    // accessToken is expired, but refreshToken not expired, refresh it to get a new accessToken
    if (isTokenExpired && !isRefreshTokenExpired) {
      try {
        const info = await refreshGitHubToken(github.refreshToken)
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            github: JSON.stringify({
              ...github,
              token: info.token,
              refreshToken: info.refreshToken,
              tokenExpiresAt: info.expiresAt,
              refreshTokenExpiresAt: info.refreshTokenExpiresAt,
            } as GithubInfo),
          },
        })
      } catch (error) {
        return github
      }
    } else {
      return github
    }

    return github
  }),

  appInstallations: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const octokit = new Octokit({
        auth: input.token,
      })

      try {
        const app = await octokit.request('GET /user/installations', {
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })

        return app.data.installations.map((i) => ({
          accountName: (i.account as any).login,
          appSlug: i.app_slug,
          installationId: i.id,
          appId: i.app_id,
          avatarUrl: i.account?.avatar_url,
        }))
      } catch (error) {
        console.log('token==========:', input.token)
        console.log('GET /user/installations error:', error)
        return []
      }
    }),

  searchRepo: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
        installationId: z.number(),
        token: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log('input', input)

      const { q = '' } = input
      const octokit = new Octokit({
        auth: input.token,
      })

      // const len = Infinity
      const len = 1000 // set a big number
      const per_page = 100
      const repos: components['schemas']['repository'][] = []

      try {
        for (let index = 0; index < len; index++) {
          const { data } = await octokit.request(
            'GET /user/installations/{installation_id}/repositories',
            {
              installation_id: input.installationId,
              per_page,
              page: index + 1,
              headers: {
                'X-GitHub-Api-Version': '2022-11-28',
              },
            },
          )

          const { repositories, total_count } = data
          // console.log('repositories.length=======:', repositories.length)

          repos.push(...repositories)
          if (repositories.length !== per_page) break
        }

        // console.log('repos.len------:', repos.length)
        return repos.filter((repo) => repo.name.includes(q)).slice(0, 5)
      } catch (error) {
        console.log('search repos error:', error)
        return []
      }
    }),

  /**
   * Get Octokit auth token
   */
  getTokenByUserId: protectedProcedure.query(async ({ ctx, input }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.token.uid },
    })

    const github = user?.github as GithubInfo
    return getTokenByInstallationId(github.installationId)
  }),

  connectRepo: protectedProcedure
    .input(
      z.object({
        repo: z.string(),
        installationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const site = await prisma.site.update({
        where: { id: ctx.activeSiteId },
        data: input,
      })

      await cacheHelper.updateMySites(ctx.token.uid, null)
      return site
    }),

  disconnectRepo: protectedProcedure.mutation(async ({ ctx, input }) => {
    const site = await prisma.site.update({
      where: { id: ctx.activeSiteId },
      data: {
        repo: '',
        installationId: null,
      },
    })
    await cacheHelper.updateMySites(ctx.token.uid, null)
    return site
  }),

  getGitHubToken: protectedProcedure
    .input(
      z.object({
        installationId: z.number(),
      }),
    )
    .query(({ input }) => {
      return getTokenByInstallationId(input.installationId)
    }),
})
