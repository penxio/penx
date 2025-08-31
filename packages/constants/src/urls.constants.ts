export const GOOGLE_OAUTH_REDIRECT_URI = 'https://www.penx.io/api/google-oauth'
// export const GOOGLE_OAUTH_REDIRECT_URI =
//   'http://localhost:4000/api/google-oauth'

export const LINK_GOOGLE_ACCOUNT_REDIRECT_URI =
  'https://www.penx.io/api/link-google-account-oauth'

export const APPLE_OAUTH_REDIRECT_URI = 'https://penx.io/api/apple-oauth'

export const PENX_URL = 'https://penx.io'
export const STATIC_URL = 'https://asset.penx.me'

export const PENX_LOGO_URL =
  'https://asset.penx.me/6198953ddef817f4466460f15cb470fd766f9fda199918588792dcd0eb432e14'

export const GOOGLE_DRIVE_OAUTH_REDIRECT_URI =
  'https://www.penx.io/api/google-drive-oauth'

export const REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL =
  'https://www.penx.io/api/refresh-google-drive-token'

export enum NetworkNames {
  ARB_SEPOLIA = 'ARB_SEPOLIA',
  BASE_SEPOLIA = 'BASE_SEPOLIA',
  BASE = 'BASE',
}

export const SYNC_SERVICE_HOST =
  process.env.NEXT_PUBLIC_SYNC_SERVICE_HOST ||
  // @ts-ignores
  import.meta.env?.VITE_SYNC_SERVICE_HOST ||
  // @ts-ignores
  import.meta.env?.WXT_SYNC_SERVICE_HOST ||
  ''

export const SHAPE_URL = SYNC_SERVICE_HOST
  ? `${SYNC_SERVICE_HOST}/api/v1/shape`
  : 'https://sync.penx.io/api/v1/shape'

// export const SHAPE_URL = `http://localhost:3001/api/v1/shape`

export const TRANSCRIBE_URL = SYNC_SERVICE_HOST
  ? `${SYNC_SERVICE_HOST}/api/transcribe`
  : 'https://sync.penx.io/api/transcribe'

export const AI_SERVICE_HOST = 'https://ai.penx.io'

export const APP_LOCAL_HOST = 'http://localhost:14158'

