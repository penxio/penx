'use client'

import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { Edit3Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useTags } from '@penx/hooks/useTags'
import { store } from '@penx/store'
import { Panel } from '@penx/types'
import { Skeleton } from '@penx/uikit/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/table'
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
  const { tags } = useTags()
  const { setState } = useTagDialog()

  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>
          <Trans>Manage tags</Trans>
        </div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>
      <TagDialog />
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Trans>Name</Trans>
              </TableHead>
              <TableHead>
                <Trans>Creation counts</Trans>
              </TableHead>
              <TableHead>
                <Trans>Created date</Trans>
              </TableHead>
              <TableHead>
                <Trans>Operation</Trans>
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
                    tooltipContent={<Trans>Delete tag</Trans>}
                    onConfirm={async () => {
                      await store.tags.deleteTag(item.raw)
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
