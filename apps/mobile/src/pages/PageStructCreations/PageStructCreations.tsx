import React from 'react'
import { MobileContent } from '@/components/MobileContent'
import { StructCreations } from '@/components/StructCreations/StructCreations'
import { Struct } from '@penx/domain'
import { PageTasks } from '../PageTasks/PageTasks'

interface Props {
  struct: Struct
}
export const PageStructCreations = ({ struct }: Props) => {
  return <Content struct={struct}></Content>
}

function Content({ struct }: Props) {
  return (
    <MobileContent title={struct.name} backgroundColor="#f6f6f6">
      <StructCreations structId={struct.id} />
    </MobileContent>
  )
}
