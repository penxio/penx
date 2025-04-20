'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { useSubscriptionGuideDialog } from '@penx/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { calculateSHA256FromFile } from '@penx/encryption'
import { useAssets } from '@penx/hooks/useAssets'
import { localDB } from '@penx/local-db'
import { uploadFile } from '@penx/services/uploadFile'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface Props {
  className?: string
}

export const UploadAssetButton = ({ className, ...rest }: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const { setIsOpen } = useSubscriptionGuideDialog()

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }

  const [uploading, setUploading] = useState(false)
  const { refetch } = useAssets()
  async function handleUpload(file: File) {
    setUploading(true)
    const fileHash = await calculateSHA256FromFile(file)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('from', 'ASSET')

    try {
      await uploadFile(file, { isPublic: false })

      toast.success('Image uploaded successfully!')

      await localDB.addFile(fileHash, file)
      await refetch()
    } catch (error) {
      console.log('=====error:', error)

      const msg = extractErrorMessage(error)
      toast.error(msg || 'Upload image failed')
    }

    setUploading(false)
  }

  return (
    <Button variant="brand" {...rest} className={cn('w-40 p-0', className)}>
      <a
        onClick={handleClick}
        className="flex h-full w-full items-center justify-center gap-2 bg-transparent px-3 text-sm"
      >
        {!uploading && <UploadCloud size={20} />}
        {!uploading && <span>Upload a image</span>}
        {uploading && (
          <div className="flex items-center gap-x-2">
            <span>Uploading</span>
            <LoadingDots className="bg-white" />
          </div>
        )}
      </a>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]!
          handleUpload(fileUploaded)
        }}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </Button>
  )
}
