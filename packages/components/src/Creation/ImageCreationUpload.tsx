import { forwardRef, useRef, useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { uploadFile } from '@penx/services/uploadFile'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface Props {
  creation: Creation
  onFileChange: (file: File) => void
  onUploaded: (url: string) => Promise<void>
}

export const ImageCreationUpload = forwardRef<HTMLDivElement, Props>(
  function ImageCreationUpload({ creation, onFileChange, onUploaded }, ref) {
    const [value, setValue] = useState((creation.imageUrl as string) || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        setLoading(true)
        const file = e.target.files[0]
        onFileChange?.(file)

        const src = URL.createObjectURL(file)
        setValue(src)

        try {
          const data = await uploadFile(file)
          const uri = data.url || data.cid || ''
          await onUploaded?.(uri)
          setValue(data.url!)
          toast.success('Image uploaded successfully')
        } catch (error) {
          console.log('Failed to upload file:', error)
          toast.error(extractErrorMessage(error) || 'Failed to upload image')
        }

        setLoading(false)
      }
    }

    async function removeImage() {
      setValue('')
      updateCreationProps(creation.id, {
        data: { url: '' },
      })
    }

    if (value) {
      return (
        <div className="relative h-auto w-full">
          <img
            src={getUrl(value)}
            width={1000}
            height={1000}
            className="max-h-[100vw] w-full cursor-pointer"
            alt=""
          />

          <X
            className="bg-foreground/10 text-foreground/80 absolute right-1 top-1 h-8 w-8 cursor-pointer rounded-full p-1"
            onClick={removeImage}
          />
        </div>
      )
    }

    return (
      <div ref={ref}>
        <div
          className={cn(
            'bg-accent border-foreground/10 relative flex h-[560px] w-full cursor-pointer items-center justify-center rounded-2xl border',
            isMobileApp && 'h-[80vw]',
          )}
        >
          <div className="z-1 text-foreground/40 absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center gap-1 text-sm">
            <ImageIcon size={18} />
            <div>Select image</div>
          </div>

          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          {loading && <LoadingDots />}
        </div>
      </div>
    )
  },
)
