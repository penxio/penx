'use client'

import { Button } from '@penx/uikit/button'
import { usePages } from '@penx/hooks/usePages'
import { Link } from '@penx/libs/i18n'
import { cn } from '@penx/utils'
import { Creation } from '@penx/db/client'
import { format } from 'date-fns'
import { Edit3Icon, Trash2 } from 'lucide-react'
import { useDeletePageDialog } from './DeletePageDialog/useDeleteDatabaseDialog'

interface PageItemProps {
  page: Creation
}

export function PageItem({ page }: PageItemProps) {
  const { setState } = useDeletePageDialog()

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          href={`/~/page?id=${page.id}`}
          className="inline-flex items-center transition-transform hover:scale-105"
        >
          <div className="text-base font-bold">{page.title || 'Untitled'}</div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-zinc-500">
          <div>{format(new Date(page.updatedAt), 'yyyy-MM-dd')}</div>
        </div>
        <Link href={`/~/page?id=${page.id}`}>
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
              pageId: page.id,
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

export function PageList() {
  const { data: pages, isLoading } = usePages()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!pages?.length) {
    return <div className="text-foreground/60">No page yet.</div>
  }

  return (
    <div className="grid gap-4">
      {pages.map((page) => {
        return <PageItem key={page.id} page={page} />
      })}
    </div>
  )
}
