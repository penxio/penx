import { createAppAuth } from '@octokit/auth-app'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

export async function getTokenByInstallationId(installationId: number) {
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
  return installationAuthentication.token
}
