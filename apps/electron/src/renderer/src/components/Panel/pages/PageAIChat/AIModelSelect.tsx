import { useState } from 'react'
import { ChevronRightIcon } from 'lucide-react'
import { useMySpace } from '@penx/hooks/useMySpace'
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

export type ModelProvider = {
  type: LLMProviderType
  model: string
  apiKey?: string
}

interface Props {
  value: ModelProvider
  onChange: (v: ModelProvider) => any
}
export function AIModelSelect({ value, onChange }: Props) {
  const { space } = useMySpace()
  const [open, setOpen] = useState(false)
  const { aiProviders = [] } = space

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="" asChild>
        <div className="no-drag flex cursor-pointer items-center">
          <div>{value.model === 'PENX' ? 'PenX AI' : value.model}</div>
          <ChevronRightIcon size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command className="no-drag">
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
                      key={`${provider.type}_${item}`}
                      onSelect={() => {
                        onChange({
                          type: provider.type!,
                          model: item,
                          apiKey: provider.apiKey,
                        })
                        setOpen(false)
                      }}
                    >
                      {item}
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
