import { forwardRef, useRef, useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { uploadFile } from '@penx/services/uploadFile'
import { cn, getUrl } from '@penx/utils'
import { CloudUploadIcon, Edit3 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface Props {
  saveToDB?: boolean
  value?: string
  className?: string
  editIconClassName?: string
  imageClassName?: string
  width?: number
  height?: number
  onChange?: (value: string) => void
}

export const FileUpload = forwardRef<HTMLDivElement, Props>(function FileUpload(
  {
    value,
    className,
    imageClassName,
    editIconClassName,
    width = 120,
    height = 120,
    onChange,
    saveToDB = true,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setLoading(true)
      const file = e.target.files[0]
      // const src = URL.createObjectURL(file)
      // onChange?.(src)

      try {
        const data = await uploadFile(file, { saveToDB })
        console.log('==========data:', data)
        toast.success('Image uploaded successfully!')
        onChange?.(data.url!)
      } catch (error) {
        console.log('Failed to upload file:', error)
      }

      setLoading(false)
    }
  }

  return (
    <div ref={ref}>
      <div
        className={cn(
          'bg-accent relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl',
          className,
        )}
      >
        {!value && <CloudUploadIcon size={18} className="text-foreground/50" />}
        {value && (
          <Image
            src={getUrl(value)}
            width={width}
            height={height}
            className={cn(
              'absolute left-0 top-0 h-full w-full cursor-pointer',
              imageClassName,
            )}
            alt=""
          />
        )}
        <input
          ref={inputRef}
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
        />
        {loading && <LoadingDots className="bg-foreground" />}
        <div
          className={cn(
            'bg-background absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border',
            editIconClassName,
          )}
          onClick={() => {
            inputRef.current?.click()
          }}
        >
          <Edit3 size={14}></Edit3>
        </div>
      </div>
    </div>
  )
})
