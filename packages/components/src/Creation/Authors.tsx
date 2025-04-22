'use client'

import { useState } from 'react'
import { Author } from '@prisma/client'
import { Command } from 'cmdk'
import { Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { updateCreationState } from '@penx/hooks/useCreation'
import { ICreation } from '@penx/model/ICreation'
import { api, trpc } from '@penx/trpc-client'
import { Button } from '@penx/uikit/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/ui/tooltip'
import { uniqueId } from '@penx/unique-id'
import { formatUsername } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { UserAvatar } from '@penx/widgets/UserAvatar'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

export function Authors({ creation }: { creation: ICreation }) {
  const site = useSiteContext()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { data: collaborators = [] } = useCollaborators()
  const { mutateAsync: deleteAuthor, isPending } =
    trpc.creation.deleteAuthor.useMutation()

  const authors: any[] = []
  return (
    <div className="flex items-center gap-2">
      {authors.map((item) => (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="group/author relative cursor-pointer">
                <UserAvatar
                  key={item.id}
                  className="z-1 ring-foreground/10 bg-background/10 size-6"
                  address={item.user.displayName || ''}
                  image={item.user.image || ''}
                />
                {creation.userId !== item.userId && (
                  <div
                    className="bg-foreground/50 text-background absolute -right-1 -top-1  z-10 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-colors group-hover/author:inline-flex"
                    onClick={async () => {
                      try {
                        updateCreationState({
                          id: creation.id,
                          // authors: creation.authors.filter(
                          //   (author) => author.id !== item.id,
                          // ),
                        })
                        await deleteAuthor({
                          creationId: creation.id,
                          authorId: item.id,
                        })
                        toast.success('Author removed successfully!')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }}
                  >
                    <XIcon size={12} />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {formatUsername(item.user.displayName || item.user.name || '')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild className="gap-0">
          <Button
            size="xs"
            variant="outline"
            className="size-6 rounded-full border border-dashed p-0"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} className="text-foreground/60"></Plus>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="w-64 p-0">
          <Command label="Command Menu">
            <CommandInput
              autoFocus
              className=""
              placeholder="Select author"
              value={search}
              onValueChange={(v) => {
                setSearch(v)
              }}
            />
            <Command.List>
              <Command.Empty className="text-foreground/40 py-2 text-center text-sm">
                No results found.
              </Command.Empty>
              <CommandGroup heading={''}>
                {collaborators.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
                      const some = authors.some(
                        (author) => author.userId === item.userId,
                      )

                      if (some) {
                        setIsOpen(false)
                        setSearch('')
                        return
                      }
                      try {
                        const authorId = uniqueId()
                        updateCreationState({
                          id: creation.id,
                          // authors: [
                          //   ...creation.authors,
                          //   {
                          //     id: authorId,
                          //     creationId: creation.id,
                          //     userId: item.userId,
                          //     siteId: site.id,
                          //     user: item.user,
                          //     // } as AuthorWithUser,
                          //   } as any,
                          // ],
                        })
                        setIsOpen(false)
                        setSearch('')
                        await api.creation.addAuthor.mutate({
                          id: authorId,
                          creationId: creation.id,
                          userId: item.userId,
                        })
                        toast.success('Author added successfully!')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }}
                    className="flex cursor-pointer items-center gap-1 py-2"
                  >
                    <UserAvatar
                      key={item.id}
                      address={item.user.displayName || ''}
                      image={item.user.image || ''}
                    />
                    <div>
                      {formatUsername(
                        item.user.displayName || item.user.name || '',
                      )}
                    </div>
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
