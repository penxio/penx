'use client'

import { Trans } from '@lingui/react/macro'
import { EditIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { AIProvider } from '@penx/model-type'
import { store } from '@penx/store'
import { LLM_PROVIDER_INFO, LLMProviderType } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { ProviderIcon } from './icons'
import { useProviderDialog } from './useProviderDialog'

interface Props {
  provider: AIProvider
}
export function ProviderItem({ provider }: Props) {
  const { setState } = useProviderDialog()
  return (
    <div
      key={provider.type}
      className="flex cursor-pointer flex-col rounded-md py-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ProviderIcon
            llmProviderType={provider.type as LLMProviderType}
            className="mr-2"
          />
          <div className="flex flex-col">
            <span>{provider.name || provider.type}</span>
          </div>
        </div>

        {/* {provider.availableModels && provider.availableModels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {provider.availableModels.map((model: string) => (
              <Badge key={model} variant="outline" className={` text-xs`}>
                {model}
              </Badge>
            ))}
          </div>
        )} */}
        <div className="flex items-center gap-1">
          {/* <Button className="" variant="ghost" size="sm">
            <Trans>Verify</Trans>
          </Button> */}

          <Button
            className="size-9 text-red-500/60 hover:text-red-500"
            variant="ghost"
            size="icon"
            onClick={async () => {
              if (
                confirm(
                  `Are you sure you want to delete the ${LLM_PROVIDER_INFO[provider.type].name} provider?`,
                )
              ) {
                try {
                  await store.space.deleteAIProvider(provider.type)
                  toast.success(
                    `${LLM_PROVIDER_INFO[provider.type]?.name} provider deleted successfully`,
                  )
                } catch (error) {
                  console.error('Failed to delete provider:', error)
                  toast.error('Failed to delete provider')
                }
              }
            }}
          >
            <Trash2Icon size={16} />
          </Button>
          <Button
            className="size-9"
            variant="ghost"
            size="icon"
            onClick={() =>
              setState({
                open: true,
                provider,
                providerType: provider.type,
              })
            }
          >
            <EditIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
