import React from 'react'
import { impact } from '@/lib/impact'
import { Dialog } from '@capacitor/dialog'
import { IonFab } from '@ionic/react'
import { t } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { PublishStructInput } from '@penx/constants'
import { useStructs } from '@penx/hooks/useStructs'
import { useStructTemplates } from '@penx/hooks/useStructTemplates'
import { useSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface Props {
  structId: string
}

export const StructInfoFooter = ({ structId }: Props) => {
  const { session } = useSession()
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === structId)!
  const { i18n } = useLingui()
  const { refetch } = useStructTemplates()

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['structs', structId],
    mutationFn: async (input: PublishStructInput) => api.publishStruct(input),
  })

  if (!session) return null
  if (struct.userId !== session.userId) return null

  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="center"
      className="flex w-full flex-col"
    >
      <div
        className={cn('relative inline-flex items-center justify-center pb-6')}
      >
        <div
          className="shadow-popover bg-background text-foreground relative inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-full px-4 text-center font-bold"
          onClick={async () => {
            impact()
            const { value } = await Dialog.confirm({
              title: t`Confirm Publishing`,
              message: t`Are you sure you want to publish this struct to the marketplace?`,
            })

            if (value) {
              try {
                await mutateAsync({
                  id: structId,
                  name: struct.name,
                  pluralName: struct.name,
                  type: struct.type,
                  locale: i18n.locale,
                  color: struct.color,
                  emoji: struct.emoji,
                  about: '',
                  columns: struct.columns,
                })
                refetch()
                toast.success(t`Struct published successfully!`)
              } catch (error) {
                toast.error(extractErrorMessage(error))
              }
            }
          }}
        >
          {isPending ? (
            <LoadingDots className="bg-background" />
          ) : (
            <div>
              <Trans>Publish to marketplace</Trans>
            </div>
          )}
        </div>
      </div>
    </IonFab>
  )
}
