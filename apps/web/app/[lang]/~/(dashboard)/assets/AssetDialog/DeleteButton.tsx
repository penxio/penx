'use client'

import { Button } from '@/components/ui/button'
import { useAssets } from '@/hooks/useAssets'
import { useTrashedAssets } from '@/hooks/useTrashedAssets'
import { trpc } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
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
          <Trans>Delete permanently</Trans>
        ) : (
          <Trans>Trash</Trans>
        )}
      </div>
    </Button>
  )
}
