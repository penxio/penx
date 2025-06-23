import { useMemo } from 'react'
import { useScrolled } from '@/hooks/useScrolled'
import { useWidget } from '@/hooks/useWidget'
import { EDIT_WIDGET } from '@/lib/constants'
import { impact } from '@/lib/impact'
import { isAndroid, isIOS } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { structIdAtom } from '@penx/hooks/useStructId'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { WidgetName } from '@penx/widgets/WidgetName'

interface Props {
  //
}

export const WidgetNav = ({}: Props) => {
  const { area } = useArea()
  const widgets = (area?.widgets || []) as Widget[]
  const { structs } = useStructs()
  const { widget, setWidget } = useWidget()
  const { scrolled } = useScrolled()
  const isEditActive = widget?.type === EDIT_WIDGET.type

  const pt = useMemo(() => {
    if (isAndroid) return `calc(var(--safe-area-inset-top) + 8px`
    if (isIOS) return `calc(var(--safe-area-inset-top) + 0px)`
    return 12
  }, [isAndroid, isIOS])

  return (
    <div
      className={cn(
        'no-scrollbar gap-2overflow-hidden fixed left-0 right-0 top-0 z-[30] flex w-full cursor-pointer items-center overflow-auto bg-transparent',
        scrolled && 'bg-background && border-foreground/10 border-b-[0.5px]',
      )}
      style={{
        paddingTop: pt,
      }}
    >
      <div className="flex h-10 w-auto items-center gap-2 pl-3">
        {widgets.map((item, index) => {
          const active = widget ? widget.id === item.id : index === 0
          return (
            <div
              key={item.id}
              className={cn(
                'text-foreground/40 shrink-0 text-lg font-normal',
                active && 'text-foreground text-xl font-bold',
              )}
              onClick={() => {
                impact()
                // console.log('=====item:', item)
                setWidget(item)
              }}
            >
              <WidgetName widget={item} structs={structs} />
            </div>
          )
        })}
        <Button
          variant="outline-solid"
          size="xs"
          className={cn(
            'h-7 shrink-0 rounded-full opacity-50',
            isEditActive && 'bg-foreground text-background opacity-100',
          )}
          onClick={() => {
            impact()
            setWidget(EDIT_WIDGET)
          }}
        >
          <Trans>Edit</Trans>
        </Button>
        <div className="h-3 w-0.5 shrink-0"></div>
      </div>
    </div>
  )
}
