'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { Command } from 'cmdk'
import { HashIcon, Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useCreationTagsContext } from '@penx/contexts/CreationTagsContext'
import { useTagsContext } from '@penx/contexts/TagsContext'
import {
  addCreationTag,
  createTag,
  CreationTagWithTag,
  deleteCreationTag,
} from '@penx/hooks/useCreation'
import { getColorByName, getTextColorByName } from '@penx/libs/color-helper'
import { ICreation } from '@penx/model/ICreation'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

interface Props {
  creation: ICreation
}

export function Tags({ creation }: Props) {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const tags = useTagsContext()
  const { queryByCreation } = useCreationTagsContext()
  const creationTags = queryByCreation(creation.id)

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
          >
            <HashIcon size={12} className="inline-flex group-hover:hidden" />
            <XIcon
              size={12}
              className="hidden cursor-pointer group-hover:inline-flex"
              onClick={async () => {
                try {
                  await deleteCreationTag(item)
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
            <HashIcon size={14} className="inline-flex group-hover:hidden" />
            {/* <Plus size={16}></Plus> */}
            {/* <div>
              <Trans id="Tag"></Trans>
            </div> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="w-48 p-0">
          <Command label="Command Menu">
            <CommandInput
              autoFocus
              className=""
              placeholder="Find or create option"
              value={search}
              onValueChange={(v) => {
                setSearch(v)
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  try {
                    if (!search.trim()) return
                    setAdding(true)

                    createTag(creation, search)

                    setIsOpen(false)
                    // await refetch()
                    setSearch('')
                    setAdding(false)
                  } catch (error) {
                    const msg = extractErrorMessage(error)
                    toast.error(msg || 'Error adding tag')
                  }
                }
              }}
            />
            <Command.List>
              <Command.Empty className="text-foreground/40 flex items-center justify-center gap-1 py-2 text-center text-sm">
                {adding && (
                  <>
                    <div>
                      <Trans id="Adding tag"></Trans>
                    </div>
                    <LoadingDots className="bg-foreground" />
                  </>
                )}
                {!adding && <Trans id="Press Enter to add a tag."></Trans>}
              </Command.Empty>

              <CommandGroup heading={''}>
                {tags.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
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
                    {item.name}
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
