import { TRPCError } from '@trpc/server'
import Cloudflare from 'cloudflare'
import ky from 'ky'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { decryptString, encryptString } from '@penx/encryption'
import { DeployStatus } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { pagesProject } from '../lib/page-project'
import { protectedProcedure, router } from '../trpc'

const verifyCfPermissionRequired = async (
  account_id: string,
  apiToken: string,
): Promise<{ name: string; status: boolean }[]> => {
  const client = new Cloudflare({
    apiEmail: '',
    apiToken: apiToken,
  })

  const cfPermissionRequired: { name: string; status: boolean }[] = [
    { name: 'd1', status: true },
    { name: 'pages', status: true },
    { name: 'kv', status: true },
    // { name: 'r2', status: true },
    // { name: 'workersAI', status: true },
  ]

  // const [bucket, d1, projects, kv] = await Promise.all([
  const [d1, projects, kv] = await Promise.all([
    client.d1.database
      .list({ account_id })
      .catch((err) => ({ error: err, source: 'd1' })),
    client.pages.projects
      .list({ account_id })
      .catch((err) => ({ error: err, source: 'pages' })),
    client.kv.namespaces
      .list({ account_id })
      .catch((err) => ({ error: err, source: 'kv' })),
    // client.r2.buckets
    //   .list({ account_id })
    //   .catch((err) => ({ error: err, source: 'r2' })),
    // client.workersAI.list({ account_id }).catch((err) => ({ error: err, source: 'workersAI' })),
  ])

  // console.log('=======:bucket, d1, projects, kv:', bucket, d1, projects, kv)

  // const responses = [bucket, d1, projects, kv] as Array<{
  //   error: any
  //   source: string
  // }>

  const responses = [d1, projects, kv] as Array<{
    error: any
    source: string
  }>

  const errors = responses.filter((result) => result?.error !== undefined)

  if (errors.length > 0) {
    errors.forEach((err) => {
      // console.error(`Request ${err.source} failed:`, err.error)
      const permission = cfPermissionRequired.find((p) => p.name === err.source)
      if (permission) {
        permission.status = false
      }
    })
  }

  return cfPermissionRequired
}

export const hostedSiteRouter = router({
  myHostedSites: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.token.uid
    const sites = await prisma.hostedSite.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return sites
  }),

  cfAccountId: protectedProcedure.query(async ({ ctx, input }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.token.uid },
    })

    const cfApiToken = decryptString(
      user?.cfApiToken!,
      process.env.CF_TOKEN_ENCRYPT_KEY!,
    )

    return getAccountId(cfApiToken)
  }),

  penxVersion: protectedProcedure.query(async ({ ctx, input }) => {
    const res = await fetch(
      'https://raw.githubusercontent.com/penx-labs/penx/refs/heads/main/package.json',
    ).then((r) => r.json())
    return res?.version || ''
  }),

  siteProjectInfo: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const [site, user] = await Promise.all([
        prisma.hostedSite.findUnique({
          where: { id: input.siteId },
        }),
        prisma.user.findUnique({
          where: { id: userId },
        }),
      ])

      const cfApiToken = decryptString(
        user?.cfApiToken!,
        process.env.CF_TOKEN_ENCRYPT_KEY!,
      )

      try {
        const accountId = await getAccountId(cfApiToken)

        const client = new Cloudflare({
          apiEmail: '',
          apiToken: cfApiToken,
        })

        const project = await client.pages.projects.get(site?.name!, {
          account_id: accountId,
        })

        return project as typeof pagesProject
      } catch (error) {
        return false
      }
    }),

  deployNewSite: protectedProcedure
    .input(
      z.object({
        apiToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let apiToken = input.apiToken || ''
      if (!apiToken) {
        const user = await prisma.user.findUnique({
          where: { id: ctx.token.uid },
        })

        apiToken = decryptString(
          user?.cfApiToken || '',
          process.env.CF_TOKEN_ENCRYPT_KEY!,
        )
      }

      let accountId = ''
      try {
        accountId = await getAccountId(apiToken)

        if (!accountId) {
          return {
            code: 401,
            message: 'Invalid API token or invalid permission',
          }
        }
      } catch (error) {
        return {
          code: 401,
          message: 'Invalid API token or invalid permission',
        }
      }

      const permissionsRequired = await verifyCfPermissionRequired(
        accountId,
        apiToken,
      )
      if (
        !permissionsRequired.every((permission) => permission.status === true)
      ) {
        return {
          code: 403,
          message: 'Invalid API token',
          permissionsRequired,
        }
      }

      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          cfApiToken: encryptString(
            apiToken,
            process.env.CF_TOKEN_ENCRYPT_KEY!,
          ),
        },
      })

      const id = uniqueId()
      const site = await prisma.hostedSite.create({
        data: {
          id,
          name: `penx-${id}`,
          userId: ctx.token.uid,
        },
      })

      ky.post(`${process.env.DEPLOY_CI_HOST}/deploy-site`, {
        json: {
          siteId: site.id,
          apiToken: apiToken,
          accountId,
        },
      })

      return {
        code: 200,
        message: 'Deploy task created',
      }
    }),

  redeploy: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const site = await prisma.hostedSite.findUniqueOrThrow({
        where: { id: input.id },
      })

      const user = await prisma.user.findUnique({
        where: { id: ctx.token.uid },
      })

      const apiToken = decryptString(
        user?.cfApiToken || '',
        process.env.CF_TOKEN_ENCRYPT_KEY!,
      )

      const accountId = await getAccountId(apiToken)

      if (!accountId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid API token',
        })
      }

      ky.post(`${process.env.DEPLOY_CI_HOST}/deploy-site`, {
        json: {
          siteId: site.id,
          apiToken: apiToken,
          accountId,
          isRedeploy: true,
        },
      })

      return true
    }),

  update: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId, ...rest } = input
      await prisma.hostedSite.update({
        where: { id: siteId },
        data: {
          ...rest,
        },
      })
      return true
    }),

  getCloudFlareApiToken: protectedProcedure.query(async ({ ctx, input }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.token.uid },
    })
    if (!user?.cfApiToken) return ''

    try {
      return decryptString(
        user?.cfApiToken || '',
        process.env.CF_TOKEN_ENCRYPT_KEY!,
      )
    } catch (error) {
      return ''
    }
  }),

  updateCloudFlareApiToken: protectedProcedure
    .input(
      z.object({
        apiToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          cfApiToken: encryptString(
            input.apiToken,
            process.env.CF_TOKEN_ENCRYPT_KEY!,
          ),
        },
      })
      return true
    }),

  getDeployStatus: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const url = input.url
      if (!url) return DeployStatus.DEPLOYING

      try {
        const response = await ky.get(url, {
          timeout: 5000,
        })

        if (response.status === 200) {
          return DeployStatus.SUCCESS
        } else {
          return DeployStatus.DOMAIN_PENDING
        }
      } catch (error) {
        return DeployStatus.DOMAIN_PENDING
      }
    }),
})

async function getAccountId(apiToken: string): Promise<string> {
  const response: any = await ky
    .get('https://api.cloudflare.com/client/v4/accounts', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })
    .json()

  if (!response?.success) return ''

  const accounts = response.result

  if (accounts && accounts.length > 0) {
    const accountId = accounts[0].id
    return accountId || ''
  } else {
    return ''
  }
}
