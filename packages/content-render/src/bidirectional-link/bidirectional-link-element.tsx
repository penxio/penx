'use client'

import React from 'react'
import { cn, withRef } from '@udecode/cn'
import { getHandler, IS_APPLE } from '@udecode/plate'
import {
  PlateElement,
  useFocused,
  useReadOnly,
  useSelected,
} from '@udecode/plate/react'
// import { ContentRender } from '@penx/content-render'
// import { useCreation } from '@penx/hooks/useCreation'
import { CreationById, PanelType, SiteCreation } from '@penx/types'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@penx/uikit/hover-card'
import { useMounted } from '@penx/uikit/use-mounted'
import { uniqueId } from '@penx/unique-id'

// import { useMounted } from '../hooks/use-mounted'
// import { TBidirectionalLinkElement } from '../lib'

export const BidirectionalLinkElement = withRef<
  typeof PlateElement,
  {
    prefix?: string
    onClick?: (mentionNode: any) => void
  }
>(({ children, className, prefix, onClick, ...props }, ref) => {
  return null
  // const element = props.element as TBidirectionalLinkElement
  // const selected = useSelected()
  // const focused = useFocused()
  // const mounted = useMounted()
  // const readOnly = useReadOnly()
  // const { isLoading, data: creation } = useCreation(element.creationId)

  // if (!creation || isLoading) return null

  // return (
  //   <PlateElement
  //     ref={ref}
  //     className={cn(
  //       className,
  //       'mr-0.5 inline-block rounded-md px-0.5 py-0 align-baseline font-medium transition-all hover:scale-105',
  //       !readOnly && 'cursor-pointer',
  //       selected && focused && 'bg-foreground/5',
  //       element.children[0].bold === true && 'font-bold',
  //       element.children[0].italic === true && 'italic',
  //       element.children[0].underline === true && 'underline',
  //     )}
  //     onClick={getHandler(onClick, element)}
  //     data-slate-value={element.value}
  //     contentEditable={false}
  //     draggable
  //     {...props}
  //   >
  //     {mounted && IS_APPLE ? (
  //       // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
  //       <React.Fragment>
  //         {children}
  //         {prefix}
  //         <Content creation={creation!} />
  //       </React.Fragment>
  //     ) : (
  //       // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
  //       <React.Fragment>
  //         {prefix}
  //         <Content creation={creation!} />

  //         {children}
  //       </React.Fragment>
  //     )}
  //   </PlateElement>
  // )
})

// function Content({ creation }: { creation: CreationById }) {
//   return (
//     <HoverCard>
//       <HoverCardTrigger asChild>
//         <div
//           className="text-brand"
//           onClick={(e) => {
//             e.preventDefault()
//             addPanel({
//               id: uniqueId(),
//               type: PanelType.CREATION,
//               creation: creation as any,
//             })
//           }}
//         >
//           {creation?.title || 'Untitled'}
//         </div>
//       </HoverCardTrigger>
//       <HoverCardContent className="max-h-64 w-80 space-y-4 overflow-auto">
//         <div className="text-xl font-bold">{creation.title}</div>
//         <ContentRender content={creation.content} />
//       </HoverCardContent>
//     </HoverCard>
//   )
// }
