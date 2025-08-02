import { Creation } from '@penx/domain'
import { idb } from '@penx/indexeddb'
import { localDB } from '@penx/local-db'
import { IVoice } from '@penx/model-type'
import { base64StringToFile } from '@penx/utils/base64StringToFile'
import { uploadAudio } from './uploadAudio'

export async function tryToUploadVoice(creation: Creation, voice: IVoice) {
  if (voice.uploaded) return

  const file = base64StringToFile(
    voice.recordDataBase64!,
    voice.mimeType.split(';')[0],
  )

  try {
    const data = await uploadAudio(file)
    await idb.voice.update(voice.id, { uploaded: true })
    await localDB.updateCreationProps(creation.id, {
      data: {
        ...creation.data,
        url: data.url,
      },
    })
  } catch (error) {
    console.log('upload voice error:', error)
  }
}
