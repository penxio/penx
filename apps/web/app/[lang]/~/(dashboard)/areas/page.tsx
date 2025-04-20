import { AreaDialog } from '@penx/components/AreaDialog/AreaDialog'
import { AreaHeader } from './AreaHeader'
import { AreaList } from './AreaList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-3 p-4">
      <AreaHeader />
      <AreaList />
    </div>
  )
}
