'use client'

import { useEffect, useRef, useState } from 'react'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useMySpace } from '@penx/hooks/useMySpace'
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
import { ProviderIcon } from './icons'
import { ModelSelector } from './model-selector'

interface ProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  providerType: LLMProviderType | null
  existingProvider?: AIProvider | null // Add parameter for existing provider
}

export function ProviderEditorDialog({
  open,
  onOpenChange,
  providerType,
  existingProvider = null,
}: ProviderDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [baseURL, setBaseURL] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [modelError, setModelError] = useState('')

  // Use ref to prevent fetching models multiple times
  const modelsLoaded = useRef(false)
  const apiKeyRef = useRef('')
  const baseURLRef = useRef('')

  // Determine if we're in edit mode
  const isEditMode = Boolean(existingProvider)

  // Get effective provider type (from existing provider or from prop)
  const effectiveProviderType = existingProvider?.type || providerType

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

  // Handle provider deletion
  const handleDeleteProvider = async () => {
    if (!effectiveProviderType) return

    if (
      confirm(
        `Are you sure you want to delete the ${LLM_PROVIDER_INFO[effectiveProviderType]?.name} provider?`,
      )
    ) {
      try {
        await store.space.deleteAIProvider(effectiveProviderType)
        toast.success(
          `${LLM_PROVIDER_INFO[effectiveProviderType]?.name} provider deleted successfully`,
        )
        onOpenChange(false)
      } catch (error) {
        console.error('Failed to delete provider:', error)
        toast.error('Failed to delete provider')
      }
    }
  }

  // Initialize form with existing provider data when in edit mode
  useEffect(() => {
    if (open) {
      if (existingProvider) {
        // Edit mode - load existing data
        setApiKey(existingProvider.apiKey || '')
        setBaseURL(existingProvider.baseURL || '')
        setSelectedModels(existingProvider.availableModels || [])
        if (
          existingProvider.availableModels &&
          existingProvider.availableModels.length > 0
        ) {
          setAvailableModels(existingProvider.availableModels)
          modelsLoaded.current = true
        } else {
          modelsLoaded.current = false
        }
        apiKeyRef.current = existingProvider.apiKey || ''
        baseURLRef.current = existingProvider.baseURL || ''
      } else {
        // Add mode - reset form
        resetForm()
      }
    }
  }, [open, existingProvider])

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
    if (isEditMode && existingProvider) {
      // Preserve any properties that we're not changing
      Object.keys(existingProvider).forEach((key) => {
        if (
          key !== 'type' &&
          key !== 'apiKey' &&
          key !== 'baseURL' &&
          key !== 'defaultModel' &&
          key !== 'availableModels' &&
          !(key in provider)
        ) {
          provider[key] = existingProvider[key]
        }
      })
    }

    store.space.updateAIProvider(provider)
    onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-10 w-full"
              placeholder="Enter API key"
              autoComplete="off"
            />
            {showBaseUrlField && (
              <>
                <Label htmlFor="baseURL" className="font-medium">
                  Base URL
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
            {isEditMode && (
              <Button
                variant="destructive"
                onClick={handleDeleteProvider}
                className="w-full sm:w-auto"
              >
                <TrashIcon className="mr-1 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
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
