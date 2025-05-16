'use client'

import { useEffect, useRef, useState } from 'react'
import { Label } from '@penx/uikit/label'

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
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [isDropdownClosing, setIsDropdownClosing] = useState(false)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  // Function to handle dropdown closing
  const closeDropdown = () => {
    setIsDropdownClosing(true)
    // Close the dropdown after animation duration
    setTimeout(() => {
      setShowModelDropdown(false)
      setIsDropdownClosing(false)
    }, 150) // Match with CSS transition time
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        if (showModelDropdown) {
          closeDropdown()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModelDropdown])

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

      <div
        className="focus-within:ring-primary mt-2 flex min-h-10 cursor-pointer flex-wrap gap-2 rounded-md border p-2 focus-within:ring-1"
        onClick={() => !showModelDropdown && setShowModelDropdown(true)}
      >
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

      {showModelDropdown && (
        <div
          className={`bg-background absolute z-10 mt-1 max-h-60 w-full transform overflow-hidden rounded-md border shadow-lg transition-all duration-150 ${
            isDropdownClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div className="bg-background sticky top-0 z-10 flex items-center justify-end border-b p-1.5">
            <button
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1 transition-colors duration-150"
              onClick={(e) => {
                e.stopPropagation()
                closeDropdown()
              }}
              aria-label="Close dropdown"
            >
              <span className="icon-[mdi--close] flex size-4 items-center justify-center"></span>
            </button>
          </div>

          <div className="max-h-[200px] overflow-y-auto">
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
                    className="hover:bg-muted flex cursor-pointer items-center p-2 transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleModel(model)
                    }}
                  >
                    <div className="mr-2 flex h-5 w-5 items-center justify-center">
                      {selectedModels.includes(model) && (
                        <span className="icon-[mdi--check] text-primary size-4"></span>
                      )}
                    </div>
                    <span className="text-sm">{model}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center p-6 text-center text-sm">
                <span className="icon-[mdi--information-outline] mb-2 size-5"></span>
                No models available
              </div>
            )}
          </div>

          <div className="bg-background sticky bottom-0 z-10 flex items-center justify-end border-t p-1.5">
            <button
              className="text-primary-foreground bg-primary hover:bg-primary/90 rounded-md px-3 py-1 text-xs transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                closeDropdown()
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
