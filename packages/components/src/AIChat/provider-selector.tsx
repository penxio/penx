import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useMySpace } from '@penx/hooks/useMySpace'
import { AIProvider } from '@penx/model-type'
import { LLMProviderType, LLMProviderTypeEnum } from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { ProviderIcon } from '../AISetting/icons'

interface ProviderSelectorProps {
  onProviderChange?: (providerType: string) => void
  onModelChange?: (modelId: string) => void
  initialProvider?: string
  initialModel?: string
}

export function ProviderSelector({
  onProviderChange,
  onModelChange,
  initialProvider = '',
  initialModel = '',
}: ProviderSelectorProps) {
  const { space } = useMySpace()
  const providers = space?.props?.aiSetting?.providers || []

  // Use initialProvider/initialModel if provided, otherwise use first provider/model
  const [selectedProvider, setSelectedProvider] = useState<
    LLMProviderType | string
  >(initialProvider || providers[0]?.type || '')

  const [selectedModel, setSelectedModel] = useState<string>(
    initialModel ||
      providers.find((p) => p.type === initialProvider)?.defaultModel ||
      providers[0]?.defaultModel ||
      '',
  )

  // Update state if providers change or initial values are set
  useEffect(() => {
    if (providers.length > 0) {
      if (!selectedProvider) {
        const newProvider = initialProvider || providers[0]?.type || ''
        setSelectedProvider(newProvider)

        // Also update model if provider changes
        const provider = providers.find((p) => p.type === newProvider)
        const newModel = initialModel || provider?.defaultModel || ''
        if (newModel) setSelectedModel(newModel)
      }
    }
  }, [providers, initialProvider, initialModel])

  if (providers.length === 0) {
    return null
  }

  // Notify parent components when selection changes
  useEffect(() => {
    if (selectedProvider && onProviderChange) {
      onProviderChange(selectedProvider)
    }
  }, [selectedProvider, onProviderChange])

  useEffect(() => {
    if (selectedModel && onModelChange) {
      onModelChange(selectedModel)
    }
  }, [selectedModel, onModelChange])

  const getSelectedProviderName = () => {
    const provider = providers.find((p) => p.type === selectedProvider)
    return provider?.name || selectedProvider
  }

  const getProvider = (type: string): AIProvider | undefined => {
    return providers.find((p) => p.type === type)
  }

  const handleSelectProvider = (providerType: string) => {
    if (providerType === selectedProvider) return

    setSelectedProvider(providerType as LLMProviderType)

    // Auto-select first model or default model when provider changes
    const provider = getProvider(providerType)
    if (provider) {
      if (
        provider.defaultModel &&
        provider.availableModels?.includes(provider.defaultModel)
      ) {
        setSelectedModel(provider.defaultModel)
      } else if (provider.availableModels?.length) {
        setSelectedModel(provider.availableModels[0])
      } else {
        setSelectedModel('')
      }
    } else {
      setSelectedModel('')
    }
  }

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const displayName = selectedModel
    ? `${getSelectedProviderName()} / ${selectedModel}`
    : getSelectedProviderName()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 max-w-32 gap-1 truncate rounded-md text-xs"
        >
          <ProviderIcon
            llmProviderType={selectedProvider as LLMProviderType}
            className="mr-1 shrink-0"
          />
          <span className="truncate">{displayName}</span>
          <ChevronDown size={14} className="ml-1 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Model Selection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {providers.map((provider) => {
            const hasModels =
              provider.availableModels && provider.availableModels.length > 0

            if (hasModels) {
              return (
                <DropdownMenuSub key={provider.type}>
                  <DropdownMenuSubTrigger
                    className={
                      selectedProvider === provider.type ? 'bg-accent' : ''
                    }
                  >
                    <div className="flex items-center">
                      <ProviderIcon
                        llmProviderType={provider.type as LLMProviderType}
                        className="mr-2"
                      />
                      <span>{provider.name || provider.type}</span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {provider.availableModels?.map((model: string) => (
                        <DropdownMenuItem
                          key={model}
                          className={
                            selectedProvider === provider.type &&
                            selectedModel === model
                              ? 'bg-accent'
                              : ''
                          }
                          onClick={() => {
                            handleSelectProvider(provider.type)
                            handleSelectModel(model)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {selectedProvider === provider.type &&
                              selectedModel === model && (
                                <span className="icon-[mdi--check] text-primary size-4"></span>
                              )}
                            <span>{model}</span>
                            {model === provider.defaultModel && (
                              <span className="text-muted-foreground ml-auto text-xs">
                                (Default)
                              </span>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )
            }
            return (
              <DropdownMenuItem
                key={provider.type}
                className={
                  selectedProvider === provider.type ? 'bg-accent' : ''
                }
                onClick={() => handleSelectProvider(provider.type)}
              >
                <div className="flex items-center">
                  <ProviderIcon
                    llmProviderType={provider.type as LLMProviderType}
                    className="mr-2"
                  />
                  <span>{provider.name || provider.type}</span>
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
