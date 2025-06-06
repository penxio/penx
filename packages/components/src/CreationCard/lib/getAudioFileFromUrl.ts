export async function getAudioFileFromUrl(url: string): Promise<File> {
  try {
    const response: Response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob: Blob = await response.blob()

    const filename: string = url.split('/').pop() || 'audio.aac'

    const file: File = new File([blob], filename, {
      type: blob.type || 'audio/aac',
    })

    return file
  } catch (error) {
    console.error('error:', error)
    throw error
  }
}
