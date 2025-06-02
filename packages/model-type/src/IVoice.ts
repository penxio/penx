export interface IVoice {
  id: string

  hash?: string

  recordDataBase64?: string

  msDuration: number

  mimeType: string

  uri?: string

  uploaded: boolean
}
