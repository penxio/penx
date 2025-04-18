'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
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
            <Trans>Navigation links</Trans>
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
            <Trans>Add</Trans>
          </Button>
        </CardTitle>
      </div>
      <NavigationList />
    </div>
  )
}
