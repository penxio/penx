// export const runtime = 'edge'
// export const dynamic = 'force-static'

import { CommissionPayout } from './CommissionPayout'
import { ReferralList } from './ReferralList'

export default function Page() {
  return (
    <div className="space-y-10">
      <CommissionPayout />
      <div>
        <div className="text-xl font-semibold">My referrals</div>
        <ReferralList />
      </div>
    </div>
  )
}
