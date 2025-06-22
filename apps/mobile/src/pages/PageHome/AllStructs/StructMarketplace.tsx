import { PagePublishedStructInfo } from '@/pages/PagePublishedStructInfo/PagePublishedStructInfo'
import { IonNavLink } from '@ionic/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { useStructTemplates } from '@penx/hooks/useStructTemplates'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

interface Props {
  onSelect?: (struct: Struct) => void
}

export function StructMarketplace({ onSelect }: Props) {
  const { structs } = useStructs()

  const { data = [], isLoading } = useStructTemplates()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-5">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-0.5 pb-2">
      {data.map((struct) => {
        const columns = struct.columns as any as IColumn[]
        const installed = structs.some((s) => s.type === struct.type)
        return (
          <div
            key={struct.id}
            className={cn(
              'text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center justify-between gap-2 rounded-full',
            )}
          >
            <IonNavLink
              className="flex flex-1 items-center gap-2 py-2"
              routerDirection="forward"
              component={() => (
                <PagePublishedStructInfo struct={struct as any} />
              )}
            >
              <ColorfulStructIcon struct={struct as any} />
              <div className="flex-1 overflow-hidden">
                <div className="text-foreground font-semibold">
                  {struct.name}
                </div>
                <div className="text-foreground/50 max-w-[60vw] truncate text-xs">
                  {struct.description || (
                    <Trans>No introduction for the struct</Trans>
                  )}
                </div>
              </div>
            </IonNavLink>

            <Button
              size="sm"
              className=""
              disabled={installed}
              onClick={() => {
                store.structs.installStruct({
                  id: struct.id,
                  name: struct.name,
                  pluralName: struct.pluralName,
                  columns: columns,
                  description: struct.description,
                  color: struct.color,
                })
                toast.success(t`Struct installed successfully!`)
              }}
            >
              {installed ? <Trans>Installed</Trans> : <Trans>Install</Trans>}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
