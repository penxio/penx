'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { nextTick } from 'process'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useQuery } from '@tanstack/react-query'
import { editorDefaultValue } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { useCreations } from '@penx/hooks/useCreations'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@penx/uikit/ui/sidebar'
import { uniqueId } from '@penx/unique-id'
import { useAreaContext } from '../AreaContext'
import { AppSidebar } from '../Sidebar/app-sidebar'
import { PanelList } from './PanelList'

const SHAPE_URL = 'http://43.154.135.183:4000/v1/shape'

async function init() {
  const creationStream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: `creation`,
      // where: `"siteId" = '${session.siteId}'`,
    },
  })

  console.log('nextTick............')

  const creationShape = new Shape(creationStream)
  // const creationRows = await creationShape.rows
  // console.log('=======r:', creationRows)

  creationStream.subscribe((res) => {
    // creationShape.subscribe((res) => {
    // rows is an array of the latest value of each row in a shape.
    console.log('res=========>>>>>>>>sub:', res)
  })
}

export function PanelLayout({ children }: { children: ReactNode }) {
  useSiteTags()
  useCollaborators()
  const site = useSiteContext()
  const { session } = useSession()
  const area = useAreaContext()
  if (!session) return null

  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset className="relative">
        <PanelList />
      </SidebarInset>
    </SidebarProvider>
  )
}
