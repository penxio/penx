'use client'

import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAvailableModels } from '@penx/libs/ai/helper'
import { AIModel } from '@penx/model-type'
import { LLMProviderType } from '@penx/types'
import { Label } from '@penx/uikit/label'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'

interface ModelSelectorProps {
  providerType: LLMProviderType
  selectedModels: AIModel[]
  onChange: (models: AIModel[]) => void
}

export function ModelSelector({
  selectedModels,
  providerType,
  onChange,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const modelDropdownRef = useRef<HTMLDivElement>(null)
  const models = getAvailableModels(providerType)

  const toggleModel = (model: AIModel) => {
    onChange(
      selectedModels.some((m) => m.id === model.id)
        ? selectedModels.filter((m) => m.id !== model.id)
        : [...selectedModels, model],
    )
  }

  const removeModel = (model: AIModel) => {
    onChange(selectedModels.filter((m) => m.id !== model.id))
  }

  return (
    <div className="relative mt-2" ref={modelDropdownRef}>
      <Label htmlFor="model" className="font-medium">
        Models
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="focus-within:ring-primary mt-2 flex min-h-10 cursor-pointer flex-wrap gap-2 rounded-md border p-2 focus-within:ring-1">
            {selectedModels.length > 0 ? (
              selectedModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-muted/50 border-muted-foreground/20 flex items-center rounded-md border py-1 pl-2 pr-1 text-sm"
                >
                  <span className="max-w-[200px] truncate">{model.label}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted ml-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeModel(model)
                    }}
                  >
                    <span className="icon-[mdi--close] flex size-4 items-center justify-center"></span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">Select models</div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="max-h-[260px] w-[var(--radix-popover-trigger-width)] overflow-y-auto p-1">
          <>
            {models.map((model) => (
              <div
                key={model.id}
                className="hover:bg-foreground/10  flex cursor-pointer items-center justify-between rounded-md p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleModel(model)
                }}
              >
                <span className="text-sm">{model.label}</span>
                <div className="mr-2 flex h-5 w-5 items-center justify-center">
                  {selectedModels.some((m) => m.id === model.id) && (
                    <span className="icon-[mdi--check] text-primary ml-auto size-4"></span>
                  )}
                </div>
              </div>
            ))}
          </>
        </PopoverContent>
      </Popover>
    </div>
  )
}
