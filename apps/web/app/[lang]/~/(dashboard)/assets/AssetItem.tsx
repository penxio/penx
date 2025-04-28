'use client'

import { Skeleton } from '@penx/uikit/skeleton'
import { Asset } from '@penx/hooks/useAssets'
import { useLoadAsset } from '@penx/hooks/useLoadAsset'
import { placeholderBlurhash } from '@penx/constants'
import Image from 'next/image'
import { useAssetDialog } from './AssetDialog/useAssetDialog'

interface AssetItemProps {
  asset: Asset
}

export function AssetItem({ asset }: AssetItemProps) {
  const { setState } = useAssetDialog()
  const { url, isLoading } = useLoadAsset(asset)
  console.log('url=======:', url)

  if (isLoading) {
    return (
      <Image
        alt=""
        className="mb-5 transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        src={placeholderBlurhash}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />
    )
  }

  return (
    <div
      key={asset.id}
      className="after:content after:shadow-highlight group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg"
      onClick={() => {
        setState({
          isOpen: true,
          asset: asset,
        })
      }}
    >
      <img
        alt={asset.filename || ''}
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        // placeholder="blur"
        // blurDataURL={placeholderBlurhash}
        src={url}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />
    </div>
  )
}
