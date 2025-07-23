import { useMemo } from 'react'
import { impact } from '@/lib/impact'
import { isIOS } from '@/lib/utils'
import { Dialog } from '@capacitor/dialog'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon, CopyIcon, UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { ProfileBasicInfo } from '@penx/components/ProfileBasicInfo'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { PlanType } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Badge } from '@penx/uikit/ui/badge'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { AddWidgetButton } from '../EditWidget/AddWidgetButton'
import { EditWidget } from '../EditWidget/EditWidget'
import { Card } from '../ui/Card'
import { CardItem } from '../ui/CardItem'
import { MenuItem } from '../ui/MenuItem'
import { AboutMenu } from './AboutMenu'
import { GuideEntryMenu } from './GuideEntryMenu'
import { JournalLayoutMenu } from './JournalLayoutMenu'
import { LocaleMenu } from './LocaleMenu'
import { NavigationsMenu } from './NavigationsMenu'
import { PrivacyEntryMenu } from './PrivacyEntryMenu'
import { ReviewMenu } from './ReviewMenu'
import { StructsMenu } from './StructsMenu'
import { SubscriptionMenu } from './SubscriptionMenu'
import { SyncMenu } from './SyncMenu'
import { TagsMenu } from './TagsMenu'
import { ThemeMenu } from './ThemeMenu'

export function Profile() {
  const { session, logout } = useSession()

  const planType = useMemo(() => {
    if (!session) return ''
    if (session.planType === PlanType.STANDARD) return <Trans>PRO</Trans>
    if (session.planType === PlanType.PRO) return <Trans>PRO + AI</Trans>
    if (session.planType === PlanType.BELIEVER) return <Trans>Believer</Trans>
    return <Trans>Free</Trans>
  }, [session])

  const { copy } = useCopyToClipboard()

  return (
    <div className="flex flex-col pb-10">
      {!session && (
        <div
          className={cn('text-foreground flex items-center justify-between')}
          onClick={() => {
            appEmitter.emit('ROUTE_TO_LOGIN')
          }}
        >
          <div className="flex items-center gap-1">
            <div className="bg-foreground/10 flex size-12 items-center justify-center rounded-full">
              <UserIcon size={24} />
            </div>
            <div className="font-medium">
              <Trans>Login or Register</Trans>
            </div>
          </div>
          <div>
            <ChevronRightIcon className="text-foreground/50" />
          </div>
        </div>
      )}

      {session && <ProfileBasicInfo />}

      {/* <Card>PenX PRO</Card> */}
      <div className="text-foreground mt-10 flex flex-1 flex-col gap-6">
        {session?.isFree && isIOS && (
          <Card>
            <CardItem className="pr-1">
              <SubscriptionMenu />
            </CardItem>
          </Card>
        )}

        <Card>
          <CardItem className="pr-1">
            <SyncMenu />
          </CardItem>
        </Card>

        <Card>
          <CardItem className="pr-1">
            <NavigationsMenu />
          </CardItem>
          <CardItem className="pr-1">
            <StructsMenu />
          </CardItem>
          <CardItem className="pr-1">
            <TagsMenu />
          </CardItem>
        </Card>

        <Card title={<Trans>Appearance</Trans>}>
          <CardItem className="pr-1">
            <ThemeMenu />
          </CardItem>
          <CardItem className="pr-1">
            <LocaleMenu />
          </CardItem>
          <CardItem className="pr-1">
            <JournalLayoutMenu />
          </CardItem>
        </Card>

        <Card title={<Trans>About</Trans>}>
          <CardItem className="pr-1">
            <AboutMenu />
          </CardItem>
          <CardItem className="pr-1">
            <GuideEntryMenu />
          </CardItem>

          {isIOS && (
            <CardItem className="pr-1">
              <ReviewMenu />
            </CardItem>
          )}
          <CardItem className="pr-1">
            <PrivacyEntryMenu />
          </CardItem>
        </Card>

        <Card>
          {session && (
            <CardItem
              className="text-red-500"
              onClick={async () => {
                const { value } = await Dialog.confirm({
                  title: t`Delete account`,
                  message: t`All your data will be deleted. This action cannot be undone. Are you sure you want to delete your account?`,
                })

                if (value) {
                  toast.promise(
                    async () => {
                      await api.deleteAccount()
                      await localDB.deleteAllSpaceData(session.spaceId)
                      await logout()
                      appEmitter.emit('ON_LOGOUT_SUCCESS')
                      appEmitter.emit('DELETE_ACCOUNT')
                    },
                    {
                      loading: t`Account deletion in progress...`,
                      success: t`Account deleted successfully!`,
                      error: () => {
                        return t`Failed to delete account. Please try again.`
                      },
                    },
                  )
                }
              }}
            >
              <Trans>Delete account</Trans>
            </CardItem>
          )}

          {session && (
            <MenuItem
              className="text-red-500"
              onClick={async () => {
                const { value } = await Dialog.confirm({
                  title: t`Log out`,
                  message: t`Are you sure you want to log out?`,
                })

                if (value) {
                  await logout()
                  appEmitter.emit('ON_LOGOUT_SUCCESS')
                }
              }}
            >
              <Trans>Log out</Trans>
            </MenuItem>
          )}
        </Card>
      </div>
    </div>
  )
}
