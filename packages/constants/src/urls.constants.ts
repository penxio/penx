import { isProd, isWeb, ROOT_HOST } from './basic.constants'

// export const GOOGLE_OAUTH_REDIRECT_URI = 'https://www.penx.io/api/google-oauth'
export const GOOGLE_OAUTH_REDIRECT_URI =
  'http://localhost:4000/api/google-oauth'

export const LINK_GOOGLE_ACCOUNT_REDIRECT_URI =
  'https://www.penx.io/api/link-google-account-oauth'

export const PENX_URL = 'https://penx.io'
export const STATIC_URL = 'https://asset.penx.me'

export const PENX_LOGO_URL =
  'https://asset.penx.me/6198953ddef817f4466460f15cb470fd766f9fda199918588792dcd0eb432e14'

// export const IPFS_UPLOAD_URL = 'https://penx.io/api/ipfs-upload'
export const IPFS_UPLOAD_URL = '/api/ipfs-upload'
export const IPFS_ADD_URL = 'https://penx.io/api/ipfs-add'
// export const IPFS_ADD_URL = 'http://localhost:4000/api/ipfs-add'
export const IPFS_GATEWAY = 'https://ipfs-gateway.spaceprotocol.xyz'

export const GOOGLE_DRIVE_OAUTH_REDIRECT_URI =
  'https://www.penx.io/api/google-drive-oauth'

export const REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL =
  'https://www.penx.io/api/refresh-google-drive-token'

export enum NetworkNames {
  ARB_SEPOLIA = 'ARB_SEPOLIA',
  BASE_SEPOLIA = 'BASE_SEPOLIA',
  BASE = 'BASE',
}

export const SHAPE_URL =
  !isProd && isWeb
    ? `https://sync-dev.penx.io/api/shape-proxy`
    : `https://sync.penx.io/api/shape-proxy`

// export const SHAPE_URL = `https://sync-dev.penx.io/api/shape-proxy`
// export const SHAPE_URL = `https://sync.penx.io/api/shape-proxy`
