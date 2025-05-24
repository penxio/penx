import { createImageUpload } from 'novel'
import { toast } from 'sonner'
import { uploadFile } from '../lib/uploadFile'

export const onUpload = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    toast.promise(
      async () => {
        // Successfully uploaded image
        const { url } = await uploadFile(file)
        // preload the image
        const image = new Image()
        image.src = url!

        image.onload = () => {
          resolve(url!)
        }
      },
      {
        loading: 'Uploading image...',
        success: 'Image uploaded successfully.',
        error: (e) => {
          reject(e)
          return e.message
        },
      },
    )
  })
}

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.')
      return false
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error('File size too big (max 20MB).')
      return false
    }
    return true
  },
})
