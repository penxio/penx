'use client'

import { Trans } from '@lingui/react'
import { Site } from '@prisma/client'
import { format } from 'date-fns'
import { Edit3Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useTagsContext } from '@penx/contexts/TagsContext'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { useSubscribers } from '@penx/hooks/useSubscribers'
import { deleteTag, useTags } from '@penx/hooks/useTags'
import { api } from '@penx/trpc-client'
import { Panel } from '@penx/types'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/ui/table'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { ClosePanelButton } from '../../ClosePanelButton'
import { PanelHeaderWrapper } from '../../PanelHeaderWrapper'
import { TagDialog } from './TagDialog/TagDialog'
import { useTagDialog } from './TagDialog/useTagDialog'

interface Props {
  panel: Panel
  index: number
}

export function ManageTags({ panel, index }: Props) {
  const tags = useTagsContext()
  const { setState } = useTagDialog()

  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>
          <Trans id="Manage tags"></Trans>
        </div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>
      <TagDialog />
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Trans id="Name"></Trans>
              </TableHead>
              <TableHead>
                <Trans id="Creation counts"></Trans>
              </TableHead>
              <TableHead>
                <Trans id="Created date"></Trans>
              </TableHead>
              <TableHead>
                <Trans id="Operation"></Trans>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.creationCount}</TableCell>
                <TableCell>{format(item.createdAt, 'yyyy/MM/dd')}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <ConfirmDialog
                    title={`Delete tag: ${item.name}`}
                    content="All tags in post will be deleted, are you sure you want to delete this tag?"
                    tooltipContent={<Trans id="Delete tag"></Trans>}
                    onConfirm={async () => {
                      await deleteTag(item)
                      toast.success('Tag deleted successfully!')
                    }}
                  />

                  <Edit3Icon
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      setState({
                        isOpen: true,
                        tag: item,
                        index,
                      })
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
