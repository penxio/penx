import jwt from 'jsonwebtoken'

export function generateAppleClientSecret() {
  const json = JSON.parse(process.env.APPLE_PRIVATE_KEY!)
  const key = json.key
  const privateKey = key.replace(/\\n/g, '\n')

  const clientSecret = jwt.sign(
    {
      iss: process.env.APPLE_TEAM_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: 'https://appleid.apple.com',
      sub: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    },
    // key,
    privateKey,
    {
      // algorithm: 'none',
      algorithm: 'ES256',
      header: {
        kid: process.env.APPLE_KEY_ID,
        typ: 'JWT',
      },
    } as any,
  )
  return clientSecret
}
