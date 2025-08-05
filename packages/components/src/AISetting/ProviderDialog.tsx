'use client'

import { useEffect, useRef, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { getAvailableModels } from '@penx/libs/ai/helper'
import { AIModel, AIProvider } from '@penx/model-type'
import { store } from '@penx/store'
import {
  LLM_PROVIDER_INFO,
  LLMProviderType,
  LLMProviderTypeEnum,
} from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { Input } from '@penx/uikit/input'
import { Label } from '@penx/uikit/label'
import { PasswordInput } from '@penx/uikit/PasswordInput'
import { ProviderIcon } from './icons'
import { ModelSelector } from './model-selector'
import { useProviderDialog } from './useProviderDialog'

interface ProviderDialogProps {}

export function ProviderDialog({}: ProviderDialogProps) {
  const { open, provider, providerType, setOpen } = useProviderDialog()
  const [apiKey, setApiKey] = useState('')
  const [baseURL, setBaseURL] = useState('')
  const [selectedModels, setSelectedModels] = useState<AIModel[]>(
    provider?.availableModels || [],
  )

  // Determine if we're in edit mode
  const isEditMode = !!provider

  // Get effective provider type (from existing provider or from prop)
  const currentProviderType = providerType || provider?.type

  const resetForm = () => {
    setApiKey('')
    setBaseURL('')
    setSelectedModels([])
  }

  // Initialize form with existing provider data when in edit mode
  useEffect(() => {
    if (provider) {
      // Edit mode - load existing data
      setApiKey(provider.apiKey || '')
      setBaseURL(provider.baseURL || '')
      setSelectedModels(provider.availableModels || [])
    } else {
      // Add mode - reset form
      resetForm()
    }
  }, [provider])

  const handleSave = () => {
    console.log('save.......')

    if (!currentProviderType) return

    const provider: AIProvider = {
      type: currentProviderType,
      enabled: true,
      apiKey: apiKey,
      baseURL: baseURL || undefined,
    }

    if (selectedModels.length > 0) {
      provider.defaultModel = selectedModels[0]
      provider.availableModels = selectedModels
    }

    if (isEditMode && provider) {
      // Preserve any properties that we're not changing
      Object.keys(provider).forEach((key) => {
        if (
          key !== 'type' &&
          key !== 'apiKey' &&
          key !== 'baseURL' &&
          key !== 'defaultModel' &&
          key !== 'availableModels' &&
          !(key in provider)
        ) {
          provider[key] = provider[key]
        }
      })
    }

    store.space.updateAIProvider(provider)
    setOpen(false)
    resetForm()

    toast.success(
      isEditMode
        ? `${LLM_PROVIDER_INFO[currentProviderType]?.name} updated successfully`
        : `${LLM_PROVIDER_INFO[currentProviderType]?.name} added successfully`,
    )
  }

  const providerName = currentProviderType
    ? LLM_PROVIDER_INFO[currentProviderType]?.name
    : ''

  const showBaseUrlField =
    currentProviderType === LLMProviderTypeEnum.OPENAI_COMPATIBLE

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            {currentProviderType && (
              <>
                <ProviderIcon
                  llmProviderType={currentProviderType}
                  className="size-5"
                />
                <span>
                  {isEditMode ? 'Edit' : 'Add'} {providerName} Configuration
                </span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5">
            {isEditMode
              ? 'Update your API credentials for this AI provider.'
              : 'Add your API credentials to enable and configure this AI provider.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="apiKey" className="font-medium">
              API Key
            </Label>
            <PasswordInput
              id="apiKey"
              value={apiKey}
              onChange={(v) => setApiKey(v)}
              className="w-full"
              placeholder="Enter API key"
              autoComplete="off"
            />
            {showBaseUrlField && (
              <>
                <Label htmlFor="baseURL" className="font-medium">
                  <Trans>Base URL</Trans>
                </Label>
                <Input
                  id="baseURL"
                  type="text"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                  className="h-10 w-full"
                  placeholder="Enter Base URL"
                  autoComplete="off"
                />
              </>
            )}

            {/* Use ModelSelector component instead of inline code */}
            <ModelSelector
              providerType={currentProviderType}
              selectedModels={selectedModels}
              onChange={setSelectedModels}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={
                !apiKey ||
                (currentProviderType ===
                  LLMProviderTypeEnum.OPENAI_COMPATIBLE &&
                  !baseURL)
              }
              className="w-full sm:w-auto"
            >
              {isEditMode ? 'Save Changes' : 'Add Provider'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
