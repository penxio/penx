import { get } from 'idb-keyval'
import { ACTIVE_SPACE, STATIC_URL } from '@penx/constants'
import { calculateSHA256FromFile } from '@penx/utils/calculateSHA256FromFile'

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

export async function uploadAudio(file: File, opt = {} as UploadOptions) {
  const fileHash = await calculateSHA256FromFile(file)
  let data: UploadReturn = {}

  let filename = fileHash

  let prefix = ''
  let qs = ''
  let query = new URLSearchParams({})

  if (file.type.startsWith('audio')) {
    query.set('contentType', file.type)
    qs = `?${query.toString()}`
    prefix = 'audios/'
    if (file.name.endsWith('.mp3')) {
      filename = `${filename}.mp3`
    } else {
      filename = `${filename}.${file.type.split('/')[1]}`
    }
  }

  const pathname = `${prefix}${filename}`

  const url = `/${pathname}`

  const res = await fetch(`${STATIC_URL}/${pathname}${qs}`, {
    method: 'PUT',
    body: file,
  })

  if (!res.ok) {
    throw new Error('Failed to upload file')
  }

  data = await res.json()
  data = { ...data, url, hash: fileHash }

  return data as UploadReturn
}
