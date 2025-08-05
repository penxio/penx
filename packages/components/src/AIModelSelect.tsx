import { useState } from 'react'
import { ChevronRightIcon } from 'lucide-react'
import { useMySpace } from '@penx/hooks/useMySpace'
import { AIModel } from '@penx/model-type'
import { LLMProviderType, LLMProviderTypeEnum } from '@penx/types'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@penx/uikit/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'

export type ModelProvider = {
  type: LLMProviderType
  model: AIModel
  apiKey?: string
}

interface Props {
  className?: string
  contentClassName?: string
  commandClassName?: string
  value: ModelProvider
  onChange: (v: ModelProvider) => any
}
export function AIModelSelect({
  value,
  onChange,
  className,
  contentClassName,
  commandClassName,
}: Props) {
  const { space } = useMySpace()
  const [open, setOpen] = useState(false)
  const { aiProviders = [] } = space

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="" asChild>
        <div
          className={cn('no-drag flex cursor-pointer items-center', className)}
        >
          <div>
            {value?.model?.id === 'PENX' ? 'PenX AI' : value?.model?.label}
          </div>
          <ChevronRightIcon size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', contentClassName)} align="start">
        <Command className={cn('no-drag max-h-[100px]', commandClassName)}>
          <CommandInput placeholder="Search model" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="PenX official">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  onChange({
                    type: 'PENX',
                    model: 'PENX',
                  } as any)
                }}
              >
                PenX AI
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            {aiProviders.map((provider) => {
              if (!provider.apiKey || !provider.availableModels?.length)
                return null
              return (
                <CommandGroup
                  key={provider.type}
                  heading={provider.name || provider.type}
                >
                  {provider.availableModels?.map((item) => (
                    <CommandItem
                      key={`${provider.type}_${item.id}`}
                      className="cursor-pointer"
                      onSelect={() => {
                        onChange({
                          type: provider.type!,
                          model: item,
                          apiKey: provider.apiKey,
                        })
                        setOpen(false)
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
