export const GOOGLE_OAUTH_REDIRECT_URI = 'https://www.penx.io/api/google-oauth'
// export const GOOGLE_OAUTH_REDIRECT_URI =
//   'http://localhost:4000/api/google-oauth'

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

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as NetworkNames) || NetworkNames.BASE

export const RESPACE_BASE_URI =
  NETWORK === NetworkNames.BASE
    ? 'https://www.respace.one'
    : // : 'http://localhost:5000'
      'https://sepolia.respace.one'

export const RESPACE_SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://subgraph.satsuma-prod.com/0116b02fe157/zios-team--730474/respace/api'
    : 'https://api.studio.thegraph.com/query/88544/respace-base-sepolia/version/latest'

export const PENX_SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://subgraph.satsuma-prod.com/1428c3664ef6/forsigners-team--172328/penx/api'
    : 'https://api.studio.thegraph.com/query/88544/creation-sepolia/version/latest'

export const SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://subgraph.satsuma-prod.com/0116b02fe157/zios-team--730474/respace/api'
    : 'https://api.studio.thegraph.com/query/88544/respace-base-sepolia/version/latest'

export const ALLOCATION_CAP_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://penx.io/api/allocation-cap'
    : 'https://sepolia.penx.io/api/allocation-cap'

export const DAILY_CLAIM_CAP_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://penx.io/api/daily-claim-cap'
    : 'https://sepolia.penx.io/api/daily-claim-cap'
