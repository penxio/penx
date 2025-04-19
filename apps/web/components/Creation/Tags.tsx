'use client'

import { useState } from 'react'
import { useSession } from '@/components/session'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/ui/components/popover'
import { Creation, CreationTagWithTag } from '@/hooks/useCreation'
import { useSiteTags } from '@/hooks/useSiteTags'
import { getColorByName, getTextColorByName } from '@/lib/color-helper'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { Prop } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { uniqueId } from '@/lib/unique-id'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Command } from 'cmdk'
import { HashIcon, Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { LoadingDots } from '../icons/loading-dots'
import { Badge } from '@penx/ui/components/badge'
import { Button } from '@penx/ui/components/button'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

interface Props {
  creation: Creation
  onDeleteCreationTag: (postTag: CreationTagWithTag) => void
  onAddCreationTag: (postTag: CreationTagWithTag) => void
}

export function Tags({
  creation,
  onDeleteCreationTag,
  onAddCreationTag,
}: Props) {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { data: tags = [], refetch } = useSiteTags()
  const { mutateAsync } = trpc.tag.create.useMutation()
  const { mutateAsync: deleteCreationTag } =
    trpc.tag.deleteCreationTag.useMutation()
  const { mutateAsync: addTag } = trpc.tag.add.useMutation()

  return (
    <div className="flex items-center gap-1">
      {creation.creationTags.map((item) => (
        <div
          key={item.id}
          className={cn(
            'group relative flex cursor-pointer items-center gap-0.5 rounded-full text-sm',
            getTextColorByName(item.tag.color),
          )}
          onClick={async () => {
            try {
              onDeleteCreationTag(item)
              await deleteCreationTag(item.id)
            } catch (error) {
              toast.error(extractErrorMessage(error))
            }
          }}
        >
          <HashIcon size={12} className="inline-flex group-hover:hidden" />
          <XIcon size={12} className="hidden group-hover:inline-flex" />
          <div>{item.tag.name}</div>
        </div>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild className="gap-0">
          <Button
            size="xs"
            variant="ghost"
            className="text-foreground/60 h-7 gap-1 rounded-full px-2 text-xs"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16}></Plus>
            <div>
              <Trans>Tag</Trans>
            </div>
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
                    const { tag, creationTag: postTag } = await mutateAsync({
                      siteId: creation.siteId,
                      creationId: creation.id,
                      name: search,
                    })

                    onAddCreationTag(postTag)
                    setIsOpen(false)
                    await refetch()
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
                      <Trans>Adding tag</Trans>
                    </div>
                    <LoadingDots className="bg-foreground" />
                  </>
                )}
                {!adding && <Trans>Press Enter to add a tag.</Trans>}
              </Command.Empty>

              <CommandGroup heading={''}>
                {tags.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
                      const some = creation.creationTags.some(
                        (postTag) => postTag.tag.id === item.id,
                      )
                      if (some) {
                        setIsOpen(false)
                        setSearch('')
                        return
                      }
                      try {
                        const id = uniqueId()
                        const tag = tags.find((tag) => tag.id === item.id)!

                        onAddCreationTag({
                          id,
                          siteId: creation.siteId,
                          creationId: creation.id,
                          tagId: item.id,
                          tag,
                        } as CreationTagWithTag)

                        setIsOpen(false)
                        setSearch('')

                        await addTag({
                          id,
                          siteId: creation.siteId,
                          creationId: creation.id,
                          tagId: item.id,
                        })
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
