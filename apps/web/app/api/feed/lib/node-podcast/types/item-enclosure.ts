/** Attach a multimedia file to this item.  */
export interface ItemEnclosure {
  /** Url to the related file. */
  url: string
  /** Path to the related file on the filesystem. Used to fill out size and mime information. */
  file?: string
  /** Number of bytes in the file. The length field will defualt to 0 if the `size` or `file` fields have not been set. */
  size?: number
  /** Mime type of the file. Will be guessed from the url if this parameter is not set. */
  type?: string
}
