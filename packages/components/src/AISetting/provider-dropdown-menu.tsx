'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import {
  ALL_PROVIDERS,
  LLM_PROVIDER_INFO,
  LLMProviderType,
  LLMProviderTypeEnum,
} from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { ProviderIcon } from './icons'
import { ProviderDialog } from './ProviderDialog'
import { useProviderDialog } from './useProviderDialog'

export function ProviderDropdownMenu() {
  const { setState } = useProviderDialog()

  const handleSelect = (providerType: LLMProviderType) => {
    setState({
      open: true,
      providerType: providerType,
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <span className="icon-[mdi--plus] mr-1 size-4"></span>
            <span>
              <Trans>Add Provider</Trans>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {ALL_PROVIDERS.map((providerType) => (
            <DropdownMenuItem
              key={providerType}
              onClick={() => handleSelect(providerType)}
            >
              <ProviderIcon llmProviderType={providerType} className="mr-2" />
              <span>{LLM_PROVIDER_INFO[providerType].name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProviderDialog />
    </>
  )
}
