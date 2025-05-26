import { GOOGLE_DRIVE_FOLDER_PREFIX } from '@penx/constants'
import { GoogleDrive } from './google-drive'

export async function uploadToGoogleDrive(fileHash: string, file: File) {
  // const token = await api.google.googleDriveToken.query()
  // if (!token?.access_token) return
  // const drive = new GoogleDrive(token?.access_token!)
  // const baseFolderId = await drive.getOrCreateFolder(
  //   GOOGLE_DRIVE_FOLDER_PREFIX + spaceId + '-assets',
  // )
  // let files = await drive.searchFilesByPath(baseFolderId, fileHash)
  // if (!files.length) {
  //   await drive.createFile(fileHash, file, baseFolderId)
  // }
}
