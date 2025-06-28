'use client'

import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Command } from 'cmdk'
import { CheckIcon, HashIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import {
  addCreationTag,
  createTag,
  deleteCreationTag,
} from '@penx/hooks/useCreation'
import { useCreationTags } from '@penx/hooks/useCreationTags'
import { useTags } from '@penx/hooks/useTags'
import { getColorByName, getTextColorByName } from '@penx/libs/color-helper'
import { useSession } from '@penx/session'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

interface Props {
  creation: Creation
}

export function Tags({ creation }: Props) {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { tags } = useTags()
  const { queryByCreation } = useCreationTags()
  const creationTags = queryByCreation(creation.id)

  const filteredTags = tags.filter((t) => {
    return t.name.toLowerCase().includes(search.toLowerCase())
  })

  if (search.length && filteredTags.length === 0) {
    filteredTags.push({
      id: 'CREATE',
      name: search,
    } as any)
  }

  return (
    <div className="flex items-center gap-1">
      {creationTags.map((item) => {
        const tag = tags.find((t) => t.id === item.tagId)!
        if (!tag) return null
        return (
          <div
            key={item.id}
            className={cn(
              'group relative flex items-center gap-0.5 rounded-full text-sm',
              getTextColorByName(tag.color),
            )}
            onClick={() => {
              if (isMobileApp) deleteCreationTag(item.raw)
            }}
          >
            <HashIcon size={12} className="inline-flex group-hover:hidden" />
            <XIcon
              size={12}
              className="hidden cursor-pointer group-hover:inline-flex"
              onClick={async () => {
                try {
                  await deleteCreationTag(item.raw)
                } catch (error) {
                  toast.error(extractErrorMessage(error))
                }
              }}
            />
            <div>{tag.name}</div>
          </div>
        )
      })}

      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild className="gap-0">
          <Button
            size="xs"
            variant="ghost"
            className="text-foreground/60 h-7 gap-1 rounded-full px-2 text-xs"
            onClick={() => setIsOpen(true)}
          >
            <div>
              <Trans>Tag</Trans>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="w-48 p-0">
          <Command
            label=""
            value={q}
            onSelect={(v) => {
              // console.log('select value====:', v)
            }}
            onValueChange={(v) => {
              setQ(v)
            }}
            shouldFilter={false}
            filter={() => {
              return 1
            }}
          >
            <CommandInput
              autoFocus
              className=""
              placeholder={t`Find or create option`}
              value={search}
              onValueChange={(v) => {
                setSearch(v)
              }}
            />
            <Command.List>
              <Command.Empty className="text-foreground/40 flex items-center justify-center gap-1 py-2 text-center text-sm">
                <Trans>Press Enter to add a tag.</Trans>
              </Command.Empty>

              <CommandGroup heading={''}>
                {filteredTags.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
                      if (item.id === 'CREATE') {
                        createTag({
                          tagName: search,
                          creation,
                        })
                        setIsOpen(false)
                        setSearch('')
                        return
                      }

                      const some = creationTags.some(
                        (postTag) => postTag.tagId === item.id,
                      )
                      if (some) {
                        setIsOpen(false)
                        setSearch('')
                        return
                      }
                      try {
                        const tag = tags.find((tag) => tag.id === item.id)!

                        addCreationTag(creation, tag)

                        setIsOpen(false)
                        setSearch('')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }}
                    className="cursor-pointer py-2"
                  >
                    {item.id === 'CREATE' ? (
                      <>
                        <div className="text-foreground/80 text-sm">Create</div>
                        <div>{item.name}</div>
                        <Button size="xs" className="h-7">
                          <CheckIcon size={16}></CheckIcon>
                        </Button>
                      </>
                    ) : (
                      item.name
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
