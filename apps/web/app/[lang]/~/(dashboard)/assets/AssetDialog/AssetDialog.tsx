'use client'

import { Trans } from '@lingui/react'
import { ExternalLink, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { placeholderBlurhash, STATIC_URL } from '@penx/constants'
import { Asset } from '@penx/db/client'
import { useAssets } from '@penx/hooks/useAssets'
import { useLoadAsset } from '@penx/hooks/useLoadAsset'
import { trpc } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { Switch } from '@penx/uikit/switch'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { DeleteButton } from './DeleteButton'
import { useAssetDialog } from './useAssetDialog'

interface Props {}

export function AssetDialog({}: Props) {
  const { isOpen, setIsOpen, asset: asset } = useAssetDialog()
  const { refetch } = useAssets()

  const { mutateAsync: trash, isPending } = trpc.asset.trash.useMutation()
  const { mutateAsync: updatePublicStatus } =
    trpc.asset.updatePublicStatus.useMutation()

  if (!asset) return null

  const url = `${STATIC_URL}${asset.url}`

  const name = asset.title || asset.filename
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        closable={false}
        className="bg-background flex h-screen w-screen max-w-[100wv] flex-col rounded-none border-none p-0 shadow-none"
      >
        <DialogHeader className="flex w-full flex-row items-center justify-between gap-3 px-3">
          <div className="mr-auto flex flex-row items-center gap-3">
            <DialogTitle className="hidden sm:block">{name}</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="text-sm">
                <Trans id="Public visit"></Trans>
              </div>
              <Switch
                defaultChecked={!!asset.isPublic}
                onCheckedChange={async (value) => {
                  try {
                    await updatePublicStatus({
                      assetId: asset.id,
                      isPublic: value,
                    })
                    refetch()
                    toast.success(
                      <Trans id="Image public status updated successfully!"></Trans>,
                    )
                  } catch (error) {
                    toast.error(
                      extractErrorMessage(error) || (
                        <Trans id="Failed to update public status!"></Trans>
                      ),
                    )
                  }
                }}
              />
            </div>
            <a href={url} target="_blank">
              <Button size="icon" variant="secondary" className="">
                <ExternalLink size={20} className="" />
              </Button>
            </a>
            <DeleteButton />
            <Button
              size="icon"
              variant="secondary"
              className=""
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <X size={20} className="" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 items-center justify-center">
          <AssetImage asset={asset} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AssetImageProps {
  asset: Asset
}
function AssetImage({ asset }: AssetImageProps) {
  const { isLoading, url } = useLoadAsset(asset)
  console.log('======url:', url)

  if (isLoading) return null
  return (
    <img
      alt={asset.filename || ''}
      className="h-auto max-h-[80vh] w-auto max-w-[80vw] object-contain transition-transform"
      style={{ transform: 'translate3d(0, 0, 0)' }}
      // placeholder="blur"
      // blurDataURL={placeholderBlurhash}
      src={url}
      width={720}
      height={480}
      // sizes="(max-width: 640px) 100vw,
      //       (max-width: 1280px) 50vw,
      //       (max-width: 1536px) 33vw,
      //       25vw"
    />
  )
}
