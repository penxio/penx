import { forwardRef, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { Trans } from '@lingui/react'
import { ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFile } from '@penx/services/uploadFile'
import { api, trpc } from '@penx/trpc-client'
import { CreationById } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { cn, getUrl, isIPFSCID } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { Image } from '../Image'

interface Props {
  creation: CreationById
  isCover?: boolean
  onCoverUpdated: (url: string) => Promise<void>
}

export const CoverUpload = forwardRef<HTMLDivElement, Props>(
  function CoverUpload({ creation, isCover = true, onCoverUpdated }, ref) {
    const [value, setValue] = useState(creation.image || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (isEqual(value, creation.image)) return
      setValue(creation.image || '')
    }, [creation.image])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log('====e.target.files:', e.target.files)

      if (e.target.files?.length) {
        setLoading(true)
        const file = e.target.files[0]
        const src = URL.createObjectURL(file)
        setValue(src)

        try {
          const data = await uploadFile(file)
          const uri = data.url || data.cid || ''

          // console.log('===========uri:', uri)

          await onCoverUpdated(uri)

          setValue(
            isIPFSCID(uri)
              ? `https://ipfs-gateway.spaceprotocol.xyz/ipfs/${uri}`
              : uri,
          )

          toast.success('Image uploaded successfully!')
        } catch (error) {
          console.log('Failed to upload file:', error)
          toast.error(extractErrorMessage(error) || 'Upload image failed')
        }

        setLoading(false)
      }
    }

    async function removeCover() {
      setValue('')
      await onCoverUpdated('')
    }

    if (value) {
      return (
        <div
          className={cn(
            'relative h-[360px] w-full',
            !isCover &&
              'ring-foreground/10 h-24 w-24 overflow-hidden rounded-xl ring-1',
          )}
        >
          {loading && (
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
              <div className="z-100 bg-foreground/40 flex h-8 w-20 items-center justify-center rounded-md">
                <LoadingDots className="bg-background" />
              </div>
            </div>
          )}

          <Image
            src={getUrl(value)}
            width={1000}
            height={1000}
            className={cn(
              'absolute left-0 top-0 h-full w-full cursor-pointer object-cover',
            )}
            alt=""
          />

          <X
            className="absolute right-1 top-1 h-8 w-8 cursor-pointer rounded-full bg-neutral-100 p-1 text-neutral-800"
            onClick={removeCover}
          />
        </div>
      )
    }

    return (
      <div ref={ref} className="flex items-center justify-start">
        <div className="text-foreground/40 hover:text-foreground/80 relative flex h-8 w-28 cursor-pointer items-center justify-start rounded-2xl">
          <div className="z-1 absolute left-0 top-0 flex h-full w-full cursor-pointer items-center gap-1 text-xs">
            <ImageIcon size={14} />
            <div>
              {isCover ? (
                <Trans id="Add cover"></Trans>
              ) : (
                <Trans id="Add image"></Trans>
              )}
            </div>
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
