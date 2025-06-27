'use client'

import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { CheckIcon, HashIcon, PlusIcon, XIcon } from 'lucide-react'
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
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { Card } from '../ui/Card'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'
import { AddTagButton } from './AddTagButton'

interface Props {
  creation: Creation
}

export function MobileTags({ creation }: Props) {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { tags } = useTags()
  const { queryByCreation } = useCreationTags()
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
            onClick={() => setOpen(true)}
          >
            <HashIcon size={12} className="inline-flex group-hover:hidden" />
            <div>{tag.name}</div>
          </div>
        )
      })}

      {!creationTags.length && (
        <Button
          size="xs"
          variant="ghost"
          className="text-foreground/60 h-7 gap-1 rounded-full px-2 text-xs"
          onClick={() => setOpen(true)}
        >
          <div>
            <Trans>Tag</Trans>
          </div>
        </Button>
      )}
      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader
          // showCancelButton
          confirmButton={<AddTagButton creation={creation} />}
        >
          <DrawerTitle>
            <Trans>Tag</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Menu>
          {tags.map((item) => {
            const checked = creationTags.some((i) => i.tagId === item.id)
            return (
              <MenuItem
                key={item.id}
                checked={checked}
                onClick={async () => {
                  const found = creationTags.find((i) => i.tagId === item.id)

                  if (found) {
                    await deleteCreationTag(found.raw)
                  } else {
                    addCreationTag(creation, item)
                  }

                  //
                }}
              >
                <div className={cn(getTextColorByName(item.color))}>
                  {item.name}
                </div>
              </MenuItem>
            )
          })}
        </Menu>
      </Drawer>
    </div>
  )
}
