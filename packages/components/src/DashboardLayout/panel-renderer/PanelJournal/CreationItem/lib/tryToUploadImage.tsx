import { Creation } from '@penx/domain'
import { idb } from '@penx/indexeddb'
import { localDB } from '@penx/local-db'
import { uploadFile } from '@penx/services/uploadFile'

export async function tryToUploadImage(creation: Creation) {
  if (creation.imageUrl) return

  try {
    if (!creation?.data?.fileId) return
    const item = await idb.file.get(creation?.data?.fileId)
    const { url } = await uploadFile(item?.file!, {
      isPublic: false,
      saveToDB: true,
    })

    console.log('=======url:', url)

    await localDB.updateCreationProps(creation.id, {
      data: {
        ...creation.data,
        url,
      },
    })
  } catch (error) {
    console.log('upload image error:', error)
  }
}
