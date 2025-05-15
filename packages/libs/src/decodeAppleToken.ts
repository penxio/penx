import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

export type AppleUserInfo = {
  iss: string
  aud: string
  exp: number
  iat: number
  sub: string
  c_hash: string
  email: string
  email_verified: string
  auth_time: string
  nonce_supported: string
}

const clientId = 'io.penx.app'
const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
})

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key: any) {
    if (err) {
      callback(err)
    } else {
      const signingKey = key.getPublicKey()
      callback(null, signingKey)
    }
  })
}

export async function decodeAppleToken(
  accessToken: string,
): Promise<AppleUserInfo> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: 'https://appleid.apple.com',
        audience: clientId,
      },
      (err, decoded: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      },
    )
  })
}
