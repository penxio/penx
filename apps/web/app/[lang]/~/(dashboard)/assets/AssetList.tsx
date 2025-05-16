'use client'

import Image from 'next/image'
import { placeholderBlurhash } from '@penx/constants'
import { Asset, useAssets } from '@penx/hooks/useAssets'
import { useTrashedAssets } from '@penx/hooks/useTrashedAssets'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { AssetItem } from './AssetItem'

interface AssetListProps {
  isTrashed: boolean
}

export function AssetList({ isTrashed }: AssetListProps) {
  return isTrashed ? <TrashedList /> : <NormalList />
}

function NormalList() {
  const { data = [], isLoading } = useAssets()
  return <AssetListContent isLoading={isLoading} assets={data} />
}

function TrashedList() {
  const { data = [], isLoading } = useTrashedAssets()
  return <AssetListContent isLoading={isLoading} assets={data} />
}

interface AssetListContentProps {
  isLoading: boolean
  assets: Asset[]
}

function AssetListContent({ isLoading, assets }: AssetListContentProps) {
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!assets.length) {
    return <p className="text-foreground/60 px-4 text-sm">No assets found</p>
  }

  return (
    <div>
      <div className="columns-2 gap-4 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
        {assets.map((item) => (
          <AssetItem key={item.id} asset={item} />
        ))}
      </div>
    </div>
  )
}
