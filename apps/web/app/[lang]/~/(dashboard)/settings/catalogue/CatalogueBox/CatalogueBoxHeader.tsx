import { AddNodePopover } from './AddNodePopover'

export const CatalogueBoxHeader = () => {
  return (
    <div className="my-2 flex items-center justify-between gap-2">
      <div className="ml-2 text-sm font-bold">Catalogue</div>
      <AddNodePopover />
    </div>
  )
}
