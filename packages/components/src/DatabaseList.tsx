'use client'

import { Button } from '@penx/uikit/ui/button'
import { useDatabases } from '@penx/hooks/useDatabases'
import { bgColorMaps } from '@penx/libs/color-helper'
import { Link } from '@penx/libs/i18n'
import { cn } from '@penx/utils'
import { Database } from '@prisma/client'
import { format } from 'date-fns'
import { Edit3Icon, Trash2 } from 'lucide-react'
import { DeleteDatabaseDialog } from './database-ui/DeleteDatabaseDialog/DeleteDatabaseDialog'
import { useDeleteDatabaseDialog } from './database-ui/DeleteDatabaseDialog/useDeleteDatabaseDialog'

interface DatabaseItemProps {
  database: Database
}

export function DatabaseItem({ database: database }: DatabaseItemProps) {
  const { setState } = useDeleteDatabaseDialog()

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          href={`/~/database?id=${database.id}`}
          className="inline-flex items-center transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'text-background flex h-5 w-5 items-center justify-center rounded-full text-sm',
                bgColorMaps[database.color!] || 'bg-foreground/50',
              )}
            >
              #
            </span>
            <div className="text-base font-bold">
              {database.name || 'Untitled'}
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-zinc-500">
          <div>
            {format(new Date(database.updatedAt), 'yyyy-MM-dd hh:mm:ss')}
          </div>
        </div>
        <Link href={`/~/database?id=${database.id}`}>
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>Edit</div>
          </Button>
        </Link>
        <Button
          size="xs"
          variant="ghost"
          className="h-7 gap-1 rounded-full text-xs text-red-500 opacity-60"
          onClick={async () => {
            setState({
              isOpen: true,
              databaseId: database.id,
            })
          }}
        >
          <Trash2 size={14}></Trash2>
          <div>Delete</div>
        </Button>
      </div>
    </div>
  )
}

export function DatabaseList() {
  const { data: databases = [], isLoading } = useDatabases()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!databases.length) {
    return <div className="text-foreground/60">No databases yet.</div>
  }

  return (
    <div className="grid gap-4">
      <DeleteDatabaseDialog />
      {databases.map((post) => {
        return <DatabaseItem key={post.id} database={post} />
      })}
    </div>
  )
}
