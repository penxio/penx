import { get } from 'idb-keyval'

export async function getHeaders() {
  const token = localStorage.getItem('PENX_TOKEN') || (await get('PENX_TOKEN'))
  return {
    Authorization: token || '',
  }
}
