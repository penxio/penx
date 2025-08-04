'use client'

import { useRef, useState } from 'react'
import { Label } from '@penx/uikit/label'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'

interface ModelSelectorProps {
  selectedModels: string[]
  onChange: (models: string[]) => void
  availableModels: string[]
  isLoadingModels: boolean
  modelError: string
}

export function ModelSelector({
  selectedModels,
  onChange,
  availableModels,
  isLoadingModels,
  modelError,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  const toggleModel = (model: string) => {
    onChange(
      selectedModels.includes(model)
        ? selectedModels.filter((m) => m !== model)
        : [...selectedModels, model],
    )
  }

  const removeModel = (model: string) => {
    onChange(selectedModels.filter((m) => m !== model))
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
                  key={model}
                  className="bg-muted/50 border-muted-foreground/20 flex items-center rounded-md border py-1 pl-2 pr-1 text-sm"
                >
                  <span className="max-w-[200px] truncate">{model}</span>
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
          {isLoadingModels ? (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-sm">
              <span className="icon-[mdi--loading] text-primary size-5 animate-spin"></span>
              <span className="text-muted-foreground">Loading models...</span>
            </div>
          ) : modelError ? (
            <div className="flex flex-col items-center p-6 text-sm text-red-500">
              <span className="icon-[mdi--alert-circle-outline] mb-2 size-5"></span>
              {modelError}
            </div>
          ) : availableModels.length > 0 ? (
            <>
              {availableModels.map((model) => (
                <div
                  key={model}
                  className="hover:bg-foreground/10  flex cursor-pointer cursor-pointer items-center justify-between rounded-md p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleModel(model)
                  }}
                >
                  <span className="text-sm">{model}</span>
                  <div className="mr-2 flex h-5 w-5 items-center justify-center">
                    {selectedModels.includes(model) && (
                      <span className="icon-[mdi--check] text-primary ml-auto size-4"></span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center p-6 text-center text-sm">
              <span className="icon-[mdi--information-outline] mb-2 size-5"></span>
              No models available
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
