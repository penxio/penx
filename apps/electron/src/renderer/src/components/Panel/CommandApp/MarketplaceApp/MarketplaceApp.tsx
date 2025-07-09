import { useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { StyledCommandGroup } from '../../CommandComponents'
import { ExtensionDetail } from './ExtensionDetail'
import { ExtensionItem } from './ExtensionItem'
import { Skeleton } from '@penx/uikit/ui/skeleton'

export function MarketplaceApp() {
  const { data: extensions = [] } = useQuery({
    queryKey: ['extension', 'installed'],
    queryFn: () => []
  })

  const { isCommandAppDetail, setPosition } = useCommandPosition()
  return <div>Marketplace App</div>
  // const [extension, setExtension] = useState<ExtensionItem>(null as any)

  // if (isLoading)
  //   return (
  //     <Box column gap1>
  //       <Skeleton className="h-[64px]" />
  //       <Skeleton className="h-[64px]" />
  //       <Skeleton className="h-[64px]" />
  //     </Box>
  //   )

  // return (
  //   <StyledCommandGroup>
  //     {isCommandAppDetail && <ExtensionDetail item={extension} extensions={extensions} />}
  //     {!isCommandAppDetail &&
  //       data?.map((item) => {
  //         return (
  //           <ExtensionItem
  //             key={item.id}
  //             item={item}
  //             extensions={extensions}
  //             onSelect={() => {
  //               setExtension(item)
  //               setPosition('COMMAND_APP_DETAIL')
  //             }}
  //           />
  //         )
  //       })}
  //   </StyledCommandGroup>
  // )
}
