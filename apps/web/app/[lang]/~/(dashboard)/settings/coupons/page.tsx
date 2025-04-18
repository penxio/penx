import { CouponList } from './CouponList'
import { CreateCouponForm } from './CreateCouponForm'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-3">
      <CreateCouponForm />
      <CouponList />
    </div>
  )
}
