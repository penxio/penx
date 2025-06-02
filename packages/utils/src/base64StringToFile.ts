export function base64StringToFile(
  recordDataBase64: string,
  mimeType: string,
  fileName: string = 'recording',
): File {
  const byteCharacters = atob(recordDataBase64)
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0))
  const byteArray = new Uint8Array(byteNumbers)

  const getExtension = (mimeType: string): string => {
    if (mimeType.includes('aac')) return 'aac'
    if (mimeType.includes('mp3')) return 'mp3'
    if (mimeType.includes('wav')) return 'wav'
    if (mimeType.includes('ogg')) return 'ogg'
    if (mimeType.includes('webm')) return 'webm'
    return 'audio'
  }

  const extension = getExtension(mimeType)

  return new File([byteArray], `${fileName}.${extension}`, {
    type: mimeType,
    lastModified: Date.now(),
  })
}
