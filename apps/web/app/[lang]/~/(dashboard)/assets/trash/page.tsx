import { AssetDialog } from '../AssetDialog/AssetDialog'
import { AssetList } from '../AssetList'

export default function Page() {
  return (
    <div className="p-4">
      <AssetDialog />
      <AssetList isTrashed></AssetList>
    </div>
  )
}
