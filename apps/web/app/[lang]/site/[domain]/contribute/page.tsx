import { Profile } from '@/components/Profile/Profile'
import { getSite, getTiers } from '@/lib/fetchers'
import Image from 'next/image'
import { ContributeBox } from './ContributeBox'
import { GoBackButton } from './GoBackButton'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export default async function HomePage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const [site] = await Promise.all([getSite(await params)])
  const tiers = await getTiers(site.id)

  return (
    <div>
      <div className="flex items-center justify-between p-2">
        <GoBackButton />
        <Profile></Profile>
      </div>

      <div className="flex flex-col items-center gap-10 space-x-2 pt-8">
        <ContributeBox tiers={tiers} site={site} />
      </div>
    </div>
  )
}
