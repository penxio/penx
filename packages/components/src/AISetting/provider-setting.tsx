'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { EditIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useMySpace } from '@penx/hooks/useMySpace'
import { AIProvider } from '@penx/model-type'
import { store } from '@penx/store'
import { LLMProviderType } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Card, CardContent, CardHeader, CardTitle } from '@penx/uikit/card'
import { ProviderIcon } from './icons'
import { ProviderDropdownMenu } from './provider-dropdown-menu'
import { ProviderDialog } from './ProviderDialog'
import { ProviderItem } from './ProviderItem'

export function ProviderSetting() {
  const { space } = useMySpace()
  const providers = space?.props?.aiSetting?.providers || []

  // Handle provider deletion
  const handleDeleteProvider = async (providerType: string) => {
    if (
      confirm(`Are you sure you want to delete the ${providerType} provider?`)
    ) {
      try {
        // Find the provider to remove
        const providerToRemove = providers.find(
          (p: AIProvider) => p.type === providerType,
        )
        if (providerToRemove) {
          await store.space.deleteAIProvider(providerType)
          toast.success(`${providerType} provider deleted successfully`)
        }
      } catch (error) {
        console.error('Failed to delete provider:', error)
        toast.error('Failed to delete provider')
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-foreground flex items-center gap-2">
        <div className="font-semibold">
          <Trans>Your Providers</Trans>
        </div>
        <div className="ml-auto">
          <ProviderDropdownMenu />
        </div>
      </div>

      <div>
        {providers.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center">
            No providers added yet.
          </div>
        ) : (
          <div className="">
            {providers.map((provider) => (
              <ProviderItem provider={provider} />
            ))}
          </div>
        )}
      </div>

      <ProviderDialog />
    </div>
  )
}
