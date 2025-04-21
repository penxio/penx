'use client'

import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { ContentRender } from '@penx/content-render'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { editorDefaultValue } from '@penx/constants'
import { trpc } from '@penx/trpc-client'
import { Trans } from '@lingui/react'
import { StripeType } from '@prisma/client'
import { Edit, Plus } from 'lucide-react'
import { TierDialog } from './TierDialog/TierDialog'
import { useTierDialog } from './TierDialog/useTierDialog'
import { TierPriceDialog } from './TierPriceDialog/TierPriceDialog'
import { useTierPriceDialog } from './TierPriceDialog/useTierPriceDialog'

interface Props {
  type: StripeType
}

export function MembershipTiers({ type }: Props) {
  const [loading, setLoading] = useState(false)
  const site = useSiteContext()
  const tierDialog = useTierDialog()
  const priceDialog = useTierPriceDialog()
  const {
    data: tiers = [],
    isLoading,
    isFetching,
  } = trpc.tier.listSiteTiers.useQuery()

  const loadingTiers = isLoading || isFetching

  return (
    <div className="space-y-3">
      <TierDialog />
      <TierPriceDialog />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            <Trans id="Tiers"></Trans>
          </div>
          <Badge>
            {site.stripeType === StripeType.OWN ? 'Own stripe' : 'PenX stripe'}
          </Badge>
        </div>

        <Button
          variant="secondary"
          className="flex gap-2"
          disabled={loading}
          onClick={() => {
            tierDialog.setState({
              tier: null as any,
              isOpen: true,
            })
          }}
        >
          {loading && <LoadingDots className="bg-foreground" />}
          {!loading && (
            <>
              <Plus size={16} />
              <div className="">Add tier</div>
            </>
          )}
        </Button>
      </div>
      <div className="space-y-2">
        {loadingTiers && <LoadingDots className="bg-foreground" />}
        {!loadingTiers &&
          tiers.map((item) => (
            <div
              key={item.id}
              className="border-foreground/5 flex items-center justify-between rounded-2xl border p-4"
            >
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">{item.name}</div>
                <div className="flex items-center gap-1">
                  <div>${Number(item.price / 100).toFixed(2)} / month</div>
                  <Button
                    variant="secondary"
                    className="cursor-pointer rounded-full"
                    size="xs"
                    onClick={() => {
                      priceDialog.setState({
                        isOpen: true,
                        tier: item,
                      })
                    }}
                  >
                    Update price
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  tierDialog.setState({
                    isOpen: true,
                    tier: item,
                  })
                }}
              >
                <Edit size={18} />
              </Button>
            </div>
          ))}
      </div>
    </div>
  )
}
