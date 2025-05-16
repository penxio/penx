import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }

  const body = req.body as { siteId: string; version: string }

  await prisma.hostedSite.update({
    where: { id: body.siteId },
    data: {
      version: body.version,
    },
  })

  res.json({ ok: true })
}
