'use client'

import { useEffect, useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import { Progress } from '@penx/uikit/progress'
import { getUrl } from '@penx/utils'
import { Campaign } from '@penx/db/client'
import { PenIcon, Plus } from 'lucide-react'
import Image from 'next/image'
import { CampaignDialog } from './CampaignDialog/CampaignDialog'
import { useCampaignDialog } from './CampaignDialog/useCampaignDialog'

interface Props {
  campaign: Campaign
}

export function CampaignCard({ campaign }: Props) {
  const [progress, setProgress] = useState(0)
  const { setState } = useCampaignDialog()

  const percent = (100 * campaign.currentAmount) / campaign.goal
  // const percent = 40

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percent)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative grid gap-4">
      <CampaignDialog />
      <div className="border-foreground/10 relative flex max-w-[500px] flex-col gap-4 rounded-2xl border p-8">
        <div className="flex items-center justify-between">
          <div>ID: {campaign.id}</div>
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={() => {
              setState({
                isOpen: true,
                campaign,
              })
            }}
          >
            <PenIcon size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {campaign.image && (
            <Image
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
              <strong className="text-lg">{campaign.backerCount}</strong>{' '}
              backers
            </div>
          </div>
          <Progress value={progress} className="h-3" />

          <div>
            {percent}% towards{' '}
            <strong className="">${campaign.goal / 100}</strong> goal
          </div>
        </div>
        <Button size="xl">Support this project</Button>
      </div>
    </div>
  )
}
