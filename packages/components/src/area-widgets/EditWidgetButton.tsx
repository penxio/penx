'use client'

import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react'
import {
  BotMessageSquareIcon,
  Calendar,
  FilePenLine,
  GroupIcon,
  Rows4Icon,
  StarIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AddNoteDialog } from '@penx/components/AddNoteDialog'
import { editorDefaultValue, WidgetType } from '@penx/constants'
import { Mold } from '@penx/db/client'
import { useArea } from '@penx/hooks/useArea'
import { useMolds } from '@penx/hooks/useMolds'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import LoadingCircle from '@penx/uikit/loading-circle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Separator } from '@penx/uikit/separator'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { MoldName } from '@penx/widgets/MoldName'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { useAddNoteDialog } from '../Creation/AddNoteDialog/useAddNoteDialog'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function EditWidgetButton({ className }: Props) {
  return (
    <Button
      size="xs"
      variant="secondary"
      className="bg-foreground/8 hover:bg-foreground/10"
      onClick={() => {
        //
      }}
    >
      <Trans id="Edit widget"></Trans>
    </Button>
  )
}
