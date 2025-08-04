'use client'

import { useEffect, useRef, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { fetchAvailableModels } from '@penx/libs/ai/helper'
import { AIProvider } from '@penx/model-type'
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
  const [apiKey, setApiKey] = useState('')
  const [baseURL, setBaseURL] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [modelError, setModelError] = useState('')
  const { open, provider, providerType, setOpen } = useProviderDialog()

  // Use ref to prevent fetching models multiple times
  const modelsLoaded = useRef(false)
  const apiKeyRef = useRef('')
  const baseURLRef = useRef('')

  // Determine if we're in edit mode
  const isEditMode = !!provider

  // Get effective provider type (from existing provider or from prop)
  const effectiveProviderType = providerType || provider?.type

  const resetForm = () => {
    setApiKey('')
    setBaseURL('')
    setSelectedModels([])
    setAvailableModels([])
    setModelError('')
    modelsLoaded.current = false
    apiKeyRef.current = ''
    baseURLRef.current = ''
  }

  // Initialize form with existing provider data when in edit mode
  useEffect(() => {
    if (open) {
      if (provider) {
        // Edit mode - load existing data
        setApiKey(provider.apiKey || '')
        setBaseURL(provider.baseURL || '')
        setSelectedModels(provider.availableModels || [])
        if (provider.availableModels && provider.availableModels.length > 0) {
          setAvailableModels(provider.availableModels)
          modelsLoaded.current = true
        } else {
          modelsLoaded.current = false
        }
        apiKeyRef.current = provider.apiKey || ''
        baseURLRef.current = provider.baseURL || ''
      } else {
        // Add mode - reset form
        resetForm()
      }
    }
  }, [open, provider])

  // Fetch models when API key or baseURL changes
  useEffect(() => {
    // Skip if no provider type or apiKey
    if (
      !effectiveProviderType ||
      !apiKey ||
      (effectiveProviderType === LLMProviderTypeEnum.OPENAI_COMPATIBLE &&
        !baseURL)
    ) {
      return
    }

    // Skip if API key hasn't changed and models are already loaded
    if (
      apiKey === apiKeyRef.current &&
      baseURL === baseURLRef.current &&
      modelsLoaded.current
    ) {
      return
    }

    // Update refs to current values
    apiKeyRef.current = apiKey
    baseURLRef.current = baseURL

    const loadModels = async () => {
      setIsLoadingModels(true)
      setModelError('')

      try {
        const models = await fetchAvailableModels(
          apiKey,
          effectiveProviderType,
          baseURL,
        )
        setAvailableModels(models.map((model) => model.id))
        modelsLoaded.current = true
      } catch (error) {
        console.error('Error fetching models:', error)
        setModelError(
          'Failed to fetch models. Please check your API key and try again.',
        )
        modelsLoaded.current = false
      } finally {
        setIsLoadingModels(false)
      }
    }

    // Delay fetching models by 1 second after API key is entered to avoid frequent requests
    const timer = setTimeout(() => {
      loadModels()
    }, 1000)

    return () => clearTimeout(timer)
  }, [apiKey, baseURL, effectiveProviderType])

  const handleSave = () => {
    if (!effectiveProviderType) return

    const provider: AIProvider = {
      type: effectiveProviderType,
      enabled: true,
      apiKey: apiKey,
      baseURL: baseURL || undefined,
    }

    if (selectedModels.length > 0) {
      provider.defaultModel = selectedModels[0]
      provider.availableModels = selectedModels
    } else if (availableModels.length > 0) {
      provider.availableModels = availableModels
    }

    // If in edit mode, preserve any fields we're not editing
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
        ? `${LLM_PROVIDER_INFO[effectiveProviderType]?.name} updated successfully`
        : `${LLM_PROVIDER_INFO[effectiveProviderType]?.name} added successfully`,
    )
  }

  const providerName = effectiveProviderType
    ? LLM_PROVIDER_INFO[effectiveProviderType]?.name
    : ''

  const showBaseUrlField =
    effectiveProviderType === LLMProviderTypeEnum.OPENAI_COMPATIBLE

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            {effectiveProviderType && (
              <>
                <ProviderIcon
                  llmProviderType={effectiveProviderType}
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
              selectedModels={selectedModels}
              onChange={setSelectedModels}
              availableModels={availableModels}
              isLoadingModels={isLoadingModels}
              modelError={modelError}
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
                (effectiveProviderType ===
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
