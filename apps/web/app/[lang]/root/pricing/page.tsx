import { PlanList } from '@penx/components/PlanList'

// export const runtime = 'edge'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center pt-20">
      <PlanList />
    </div>
  )
}
