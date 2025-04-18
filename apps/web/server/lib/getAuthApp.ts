import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from 'octokit'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

export async function getAuthApp(installationId: number) {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey,
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  })

  const installationAuthentication = await auth({
    type: 'installation',
    installationId,
  })

  const octokit = new Octokit({
    auth: installationAuthentication.token,
  })
  return octokit
}
