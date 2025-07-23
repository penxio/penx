'use client'

import { useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { addCreationTag, createTag } from '@/lib/api'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { t } from '@lingui/core/macro'
import { Command } from 'cmdk'
import { produce } from 'immer'
import { Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import {
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../../command-components'

interface Props {
  value: any[]
  onChange: (tags: any[]) => void
}
export function Tags({ value: tags, onChange: setTags }: Props) {
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { session } = useSession()
  const data: any[] = []

  return (
    <div className="flex flex-wrap items-center gap-1">
      {tags.map((item) => (
        <Badge
          variant="secondary"
          key={item.id}
          className="relative gap-1 rounded-full text-xs"
          onClick={async () => {
            const newTags = tags.filter((t) => t.id !== item.id)
            setTags(newTags)
          }}
        >
          <div>{item.name}</div>
          <div className="hover:bg-foreground/50 hover:text-background inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-colors">
            <XIcon size={14} />
          </div>
        </Badge>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild className="gap-0">
          <Button
            size="xs"
            variant="outline"
            className="text-foreground/50 h-7 gap-1 rounded-full px-2 text-xs"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16}></Plus>
            <div>Add tag</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="top" className="w-48 p-0">
          <Command label="Command Menu">
            <CommandInput
              autoFocus
              className=""
              placeholder={t`Find or create option`}
              value={search}
              onValueChange={(v) => {
                setSearch(v)
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  try {
                    if (!search.trim()) return
                    setAdding(true)
                    const tag = await createTag({
                      spaceId: session.spaceId,
                      name: search.trim(),
                    })

                    setTags([...tags, tag])

                    // refetch()
                    setIsOpen(false)
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
                    <div>Adding tag</div>
                    <LoadingDots className="bg-foreground" />
                  </>
                )}
                {!adding && 'Press Enter to add a tag.'}
              </Command.Empty>
              <CommandGroup heading={''}>
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
                      const newTags = produce(tags, (draft) => {
                        const index = tags.findIndex(
                          (tag) => tag.id === item.id,
                        )

                        if (index > -1) {
                          draft.splice(index, 1)
                        } else {
                          draft.push(item)
                        }
                      })

                      setTags(newTags)
                      setSearch('')
                      setIsOpen(false)
                      try {
                        // const postTag = await addTag({
                        //   spaceId: post.spaceId,
                        //   postId: post.id,
                        //   tagId: item.id,
                        // })
                        // addPostTag(postTag)
                        // setIsOpen(false)
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
