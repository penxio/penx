'use client'

import { ReactNode, useMemo } from 'react'
import { useStructs } from '@penx/hooks/useStructs'
import { Panel, Widget } from '@penx/types'
import { WidgetName } from '@penx/widgets/WidgetName'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
  title?: ReactNode
  className?: string
}

export function PanelWidgetHeader({ panel, index, title, className }: Props) {
  const { structs } = useStructs()
  const widget = panel.widget as Widget
  const titleJSX = useMemo(() => {
    if (title) return title
    if (widget) return <WidgetName widget={widget} structs={structs} />
    return null
  }, [title, widget])

  return (
    <PanelHeaderWrapper index={index} className={className}>
      <div>{titleJSX}</div>
      <ClosePanelButton panel={panel} />
    </PanelHeaderWrapper>
  )
}
