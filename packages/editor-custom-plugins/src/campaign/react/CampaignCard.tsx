'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Campaign } from '@penx/db/client'
// import { usePathname } from '@penx/libs/i18n'
import { api, trpc } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { NumberInput } from '@penx/uikit/NumberInput'
import { Progress } from '@penx/uikit/progress'
import { Skeleton } from '@penx/uikit/skeleton'
import { getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

export function CampaignCard({ campaignId }: { campaignId: string }) {
  const { data, isLoading } = trpc.campaign.byId.useQuery(campaignId)

  if (isLoading) {
    return (
      <div className="border-foreground/10 relative flex min-h-[310px] w-full flex-col gap-4 rounded-2xl border p-8 sm:w-[500px]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
          <div className="w-full space-y-1">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="h-3" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="mt-auto w-full flex-col items-end justify-end">
          <Skeleton className="h-13" />
        </div>
      </div>
    )
  }

  if (!data) return null
  return <CampaignCardContent campaign={data as any} />
}

export function CampaignCardContent({ campaign }: { campaign: Campaign }) {
  const [inputting, setInputting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [amount, setAmount] = useState('')
  const percent = (100 * campaign.currentAmount) / campaign.goal
  const checkout = trpc.stripe.buyCampaignCheckout.useMutation()
  // const pathname = usePathname()
  const site = useSiteContext()

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percent)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="border-foreground/10 bg-background text-foreground relative flex min-h-[310px] w-full flex-col gap-4 rounded-2xl border p-8 sm:w-[500px]">
      <div className="flex items-center gap-2">
        {campaign.image && (
          <img
            width={64}
            height={64}
            src={getUrl(campaign.image || '')}
            alt=""
            className="rounded-xl"
          />
        )}
        <div>
          <div className="text-foreground flex items-center gap-1">
            <div className="text-2xl font-bold">{campaign.name}</div>
          </div>
          <div className="text-foreground/60">{campaign.description}</div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-2xl">
              ${campaign.currentAmount / 100}
            </strong>
            <span className="text-foreground/60 ml-1 text-base">
              USD raised
            </span>
          </div>
          <div>
            <strong className="text-lg">{campaign.backerCount}</strong> backers
          </div>
        </div>
        <Progress value={progress} className="h-3" />

        <div>
          {percent}% towards{' '}
          <strong className="">${campaign.goal / 100}</strong> goal
        </div>
      </div>
      {!inputting && (
        <Button className="w-full" size="xl" onClick={() => setInputting(true)}>
          Support this project
        </Button>
      )}
      {inputting && (
        <div className="flex gap-2">
          <div className="flex-2 relative">
            <span className="text-foreground absolute left-3 top-3">$</span>
            <NumberInput
              size="xl"
              value={amount}
              onChange={(v) => setAmount(v)}
              placeholder=""
              precision={0}
              className="w-full pl-7"
            />
          </div>

          <Button
            className="flex-1"
            size="xl"
            disabled={checkout.isPending || !amount}
            onClick={async () => {
              if (!amount) {
                return toast.info('Amount is required')
              }

              try {
                const res = await checkout.mutateAsync({
                  campaignId: campaign.id,
                  siteId: site.id,
                  host: window.location.host,
                  // pathname: pathname!,
                  pathname: '',
                  amount: Number(amount),
                })
                console.log('=======res:', res.success)
                window.location.href = res.url!
              } catch (error) {
                toast.error(extractErrorMessage(error))
              }
            }}
          >
            {checkout.isPending ? (
              <LoadingDots className="bg-background" />
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
