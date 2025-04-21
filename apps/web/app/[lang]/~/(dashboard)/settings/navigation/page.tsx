'use client'

import { Trans } from '@lingui/react'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@penx/uikit/ui/card'
import { NavigationList } from './NavigationList'
import { useNavLinkDialog } from './NavLinkDialog/useNavLinkDialog'

export const dynamic = 'force-static'

export default function Page() {
  const { setState } = useNavLinkDialog()

  return (
    <div className="grid gap-4">
      <div>
        <CardTitle className="flex items-center justify-between">
          <div>
            <Trans id="Navigation links"></Trans>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setState({
                isOpen: true,
                navLink: null as any,
                index: -1,
              })
            }}
          >
            <Trans id="Add"></Trans>
          </Button>
        </CardTitle>
      </div>
      <NavigationList />
    </div>
  )
}
