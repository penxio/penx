import { useMemo } from 'react'
import { AreasMenu } from '@/components/AreasMenu/AreasMenu'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { useTheme } from '@/components/theme-provider'
import { useScrolled } from '@/hooks/useScrolled'
import {
  EDIT_WIDGET,
  HEADER_HEIGHT,
  mainBackgroundDark,
  mainBackgroundLight,
} from '@/lib/constants'
import { impact } from '@/lib/impact'
import { isAndroid, isIOS } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { motion } from 'motion/react'
import { WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { structIdAtom } from '@penx/hooks/useStructId'
import { useStructs } from '@penx/hooks/useStructs'
import { useWidget } from '@penx/hooks/useWidget'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { WidgetName } from '@penx/widgets/WidgetName'
import { BraceButton } from './BraceButton'
import { ProfileButton } from './ProfileButton'

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
  const { isDark } = useTheme()

  const pt = useMemo(() => {
    if (isAndroid) return `calc(var(--safe-area-inset-top) + 8px`
    if (isIOS) return `calc(var(--safe-area-inset-top) + 0px)`
    return 12
  }, [isAndroid, isIOS])

  return (
    <div
      className={cn(
        'text-foreground fixed left-0 right-0 top-0 z-[30] flex w-full cursor-pointer flex-col items-center gap-2 overflow-hidden',
        scrolled && 'bg-background && border-foreground/10 border-b-[0.5px]',
      )}
      style={{
        background: isDark ? mainBackgroundDark : mainBackgroundLight,
        paddingTop: pt,
      }}
    >
      <div
        className="flex w-screen flex-col justify-between"
        style={{
          height: HEADER_HEIGHT,
        }}
      >
        <div className="flex items-center justify-between px-3">
          <AreasMenu />
          <div className="flex items-center gap-2">
            <BraceButton />
            <SearchButton />
            <ProfileButton />
          </div>
        </div>
        <div className="no-scrollbar flex h-10 w-auto items-center gap-2 overflow-x-auto pl-3">
          {widgets.map((item, index) => {
            const active = widget.id === item.id
            return (
              <motion.div
                key={item.id}
                // layoutId="widget-nav-item"
                className={cn(
                  'text-foreground/40 relative shrink-0 text-base font-normal',
                  active && 'text-foreground font-bold',
                )}
                onClick={() => {
                  impact()
                  // console.log('=====item:', item)
                  setWidget(item)
                }}
              >
                <motion.div>
                  <WidgetName widget={item} structs={structs} />
                </motion.div>

                {active && (
                  <motion.div
                    layoutId="widget-nav-item-border"
                    className="bg-foreground absolute -bottom-0.5 left-0 right-0 z-10 h-[3px] rounded-full"
                    // transition={{ type: 'tween', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            )
          })}
          <div className="h-3 w-0.5 shrink-0"></div>
        </div>
      </div>
    </div>
  )
}
