import { useMemo } from 'react'
import { PageStructCreations } from '@/pages/PageStructCreations/PageStructCreations'
import { PageStructInfo } from '@/pages/PageStructInfo/PageStructInfo'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { useStructs } from '@penx/hooks/useStructs'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

interface Props {
  isStructManagement?: boolean
}

export function StructList({ isStructManagement }: Props) {
  const { structs } = useStructs()
  return (
    <div className="flex flex-col gap-2 px-1 pb-2">
      {structs.map((struct) => {
        return (
          <IonNavLink
            key={struct.id}
            routerDirection="forward"
            className={cn(
              'text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center justify-between gap-2 rounded-full py-2',
            )}
            component={() =>
              isStructManagement ? (
                <PageStructInfo struct={struct} />
              ) : (
                <PageStructCreations struct={struct} />
              )
            }
          >
            <div className="flex items-center gap-2">
              <ColorfulStructIcon struct={struct} />
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
            </div>

            {isStructManagement ? (
              <Button size="xs">
                <Trans>Edit</Trans>
              </Button>
            ) : (
              <ChevronRightIcon
                size={24}
                className="text-foreground/50 ml-auto"
              />
            )}
          </IonNavLink>
        )
      })}
    </div>
  )
}
