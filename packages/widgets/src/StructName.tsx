import { ReactNode } from 'react'
import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'

interface Props {
  struct: Struct
}

export function StructName({ struct }: Props) {
  let name: ReactNode = struct.name
  return name
}
