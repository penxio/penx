import { calculateSHA256FromFile } from './calculateSHA256FromFile'
import { IPFS_GATEWAY, IPFS_UPLOAD_URL, STATIC_URL } from './constants'
import { api } from './trpc'

type UploadReturn = {
  hash?: string
  contentDisposition?: string
  contentType?: string
  pathname?: string
  url?: string
  cid?: string
}
interface UploadOptions {
  isPublic?: boolean
  saveToDB?: boolean
}

export async function uploadFile(file: File, opt = {} as UploadOptions) {
  const { isPublic = true, saveToDB = true } = opt
  const fileHash = await calculateSHA256FromFile(file)
  let data: UploadReturn = {}
  const site = (window as any).__SITE__

  let filename = fileHash

  let prefix = ''
  let qs = ''
  let query = new URLSearchParams({})
  if (file.type === 'image/svg+xml') {
    query.set('contentType', 'image/svg+xml')
    qs = `?${query.toString()}`
  }

  if (file.type === 'audio/mpeg' && file.name.endsWith('.mp3')) {
    query.set('contentType', 'audio/mpeg')
    qs = `?${query.toString()}`
    prefix = 'audios/'
    filename = `${filename}.mp3`
  }

  const pathname = `${prefix}${filename}`

  const url = `/${pathname}`
  const asset = await api.asset.getByUrl.query({ url })

  if (!asset) {
    const res = await fetch(`${STATIC_URL}/${pathname}${qs}`, {
      method: 'PUT',
      body: file,
    })

    if (!res.ok) {
      throw new Error('Failed to upload file')
    }

    data = await res.json()
    data = { ...data, url, hash: fileHash }
  } else {
    data = { ...data, url: asset.url, hash: fileHash }
  }

  if (saveToDB) {
    await api.asset.create.mutate({
      siteId: site.id,
      url,
      filename: file.name,
      contentType: file.type,
      size: file.size,
      isPublic,
      createdAt: file.lastModified ? new Date(file.lastModified) : new Date(),
    })
  }

  return data as UploadReturn
}
