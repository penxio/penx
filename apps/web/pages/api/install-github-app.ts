import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { App, Octokit } from 'octokit'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const installationId = Number(req.query.installation_id)

  const token = getJWT()
  const octokit = new Octokit({
    auth: token,
  })

  // TODO: handle error
  const { data } = await octokit.request(
    'GET /app/installations/{installation_id}',
    {
      installation_id: installationId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  console.log('==========data:', data)

  res.redirect(`/`)
}

function getJWT() {
  const appId = process.env.GITHUB_APP_ID!
  // const privateKey = process.env.PRIVATE_KEY!

  const payload = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    iss: appId,
  }

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' })
  return token
}
