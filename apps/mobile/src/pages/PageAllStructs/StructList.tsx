import { lighten, opacify, transparentize } from '@fower/color-helper'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import {
  colorNameMaps,
  getBgColor,
  getBgColorDark,
} from '@penx/libs/color-helper'
import { Avatar, AvatarFallback } from '@penx/uikit/ui/avatar'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { StructIcon } from '@penx/widgets/StructIcon'
import { PageStructInfo } from '../PageStructInfo/PageStructInfo'

interface Props {
  onSelect?: (struct: Struct) => void
}

export function StructList({ onSelect }: Props) {
  const { structs } = useStructs()
  return (
    <div className="flex flex-col gap-2 px-1 pb-2">
      {structs.map((struct) => (
        <div
          key={struct.id}
          className={cn(
            'text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center justify-between gap-2 rounded-full py-2',
          )}
          onClick={() => onSelect?.(struct)}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                // 'bg-foreground/5 flex size-7 items-center justify-center rounded-lg text-white',
                'flex size-7 items-center justify-center rounded-lg text-white',
              )}
              style={{
                background: transparentize(colorNameMaps[struct.color], 0),
                // color: colorNameMaps[struct.color],
              }}
            >
              <StructIcon type={struct.type} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-foreground font-semibold">{struct.name}</div>
              <div className="text-foreground/50 max-w-[60vw] truncate text-xs">
                {struct.description || (
                  <Trans>No introduction for the struct</Trans>
                )}
              </div>
            </div>
          </div>

          <IonNavLink
            className="shrink-0"
            routerDirection="forward"
            component={() => <PageStructInfo struct={struct} />}
          >
            <Button className="shrink-0" size="sm">
              <Trans>Edit</Trans>
            </Button>
          </IonNavLink>
        </div>
      ))}
    </div>
  )
}
