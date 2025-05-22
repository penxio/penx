'use client'

import { useStructs } from '@penx/hooks/useStructs'
import { Panel } from '@penx/types'
import { FullPageDatabase } from '../../../database-ui'

interface Props {
  panel: Panel
  index: number
}

export function PanelStruct({ panel, index }: Props) {
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === panel.structId)!
  if (!struct) return null

  return <FullPageDatabase struct={struct} />
}
