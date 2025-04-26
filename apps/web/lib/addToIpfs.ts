import { IPFS_ADD_URL } from '@penx/constants'

export async function addToIpfs(value: string) {
  const res = await fetch(IPFS_ADD_URL, {
    method: 'POST',
    body: value,
    headers: { 'Content-Type': 'application/json' },
  }).then((d) => d.json())
  return res.cid
}
