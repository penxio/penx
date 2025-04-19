import { useRef, useState } from 'react'
import { Button } from '@penx/ui/components/button'
import { Input } from '@penx/ui/components/input'
import { cn } from '@/lib/utils'
import { PenIcon, UploadCloud } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

interface Props {
  uploading: boolean
  handleFile: (file: File) => void
  onLinkChange: (url: string) => void
  className?: string
}

export const UploadButton = ({
  handleFile,
  uploading,
  className,
  onLinkChange,
  ...rest
}: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }
  const [url, setUrl] = useState('')

  return (
    <div {...rest} className={cn('flex items-center', className)}>
      <a
        onClick={handleClick}
        className="text-foreground/50 hover:text-brand flex w-full items-center gap-2 bg-transparent text-sm"
      >
        {!uploading && <UploadCloud size={20} />}
        {!uploading && <div>Upload a image</div>}
        {uploading && (
          <div className="flex items-center gap-x-2">
            <div>Uploading...</div>
          </div>
        )}
      </a>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="flex shrink-0 items-center gap-1 text-sm"
          >
            <PenIcon size={12} />
            <span>External link</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-96 items-center gap-2">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button onClick={() => onLinkChange?.(url)}>Save</Button>
        </PopoverContent>
      </Popover>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]!
          handleFile(fileUploaded)
        }}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </div>
  )
}
