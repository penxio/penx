'use client'

import { Button } from '@penx/uikit/button'
import { useAssets } from '@penx/hooks/useAssets'
import { useTrashedAssets } from '@penx/hooks/useTrashedAssets'
import { trpc } from '@penx/trpc-client'
import { Trans } from '@lingui/react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAssetDialog } from './useAssetDialog'

interface Props {}

export function DeleteButton({}: Props) {
  const { setIsOpen, asset } = useAssetDialog()
  const assets = useAssets()
  const trashedAssets = useTrashedAssets()
  const trashAsset = trpc.asset.trash.useMutation()
  const deleteAsset = trpc.asset.delete.useMutation()

  return (
    <Button
      variant="secondary"
      disabled={trashAsset.isPending || deleteAsset.isPending}
      className="item-center flex gap-1"
      onClick={async () => {
        if (asset.isTrashed) {
          await deleteAsset.mutateAsync({
            assetId: asset.id,
            key: asset.url!,
          })
          toast.success('Image deleted successfully!')
        } else {
          await trashAsset.mutateAsync({ assetId: asset.id })
          toast.success('Image trashed successfully!')
        }
        assets.refetch()
        trashedAssets.refetch()
        setIsOpen(false)
      }}
    >
      <Trash2 size={16} className="" />
      <div>
        {asset.isTrashed ? (
          <Trans id="Delete permanently"></Trans>
        ) : (
          <Trans id="Trash"></Trans>
        )}
      </div>
    </Button>
  )
}
